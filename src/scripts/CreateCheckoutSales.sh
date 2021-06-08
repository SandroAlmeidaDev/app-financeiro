#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
BASE_URL='http://localhost:9090'

if [[ $1 == "/r" ]]; then
  read -p "Filiais: " COD_FILIAIS
  read -p "Ano....: " ANO
  read -p "Dia mes: " DIAS_MESES
  read -p "Sistema: " DIR_DBF
  REPROCESSAR=true
elif [[ ! $# -eq 2 ]]; then
  clear
  echo "Parametros invalidos. Use numero filial e caminho do sistema"
  sleep 3
  exit
else
  export ANO=$(date +%Y)
  export DIAS_MESES=$(date +%d%m)
  export DATA_VENDA=$(date +%Y-%m-%d)
  COD_FILIAIS=$1
  DIR_DBF=$2
fi

#Arquivos
DIR_FILES="$HOME/vendas_pdvs"

[[ ! -d $DIR_FILES ]] && mkdir -p $DIR_FILES

function httpAPIRequest() {
  PATH_URL=$1
  JSON_FILE=$2
  CNPJ_FILIAL=$3
  DATA_VENDA=$4
  NUM_PDV=$5
  CUPOM=$6
  ORDEM=$7
  OPERACAO=$8

  curl http://localhost:9090/$PATH_URL \
    --silent \
    --insecure \
    --request POST \
    --header "content-type: application/json" \
    --data @$JSON_FILE \
    --output $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/$CUPOM-$ORDEM.output \
    --write-out %{http_code} \
    > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/http.response.code 2> $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/error.messages
  errorLevel=$?
  httpResponse=$(cat $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/http.response.code)


  jq --raw-output 'keys | @csv' $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/$CUPOM-$ORDEM.output | sed 's/"//g' > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/return.keys
  hasErrors=`grep --quiet --invert errors $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/return.keys;echo $?`

  if [[ $errorLevel -gt 0 ]] || [[ $hasErrors -gt 0 ]] || [[ "$httpResponse" != "200" ]]; then
    echo -ne "Error $errorLevel, pdv: $NUM_PDV cupom: $CUPOM http response code $httpResponse\n" >> $DIR_FILES/$CNPJ_FILIAL/error-`date +%Y-%m-%d`.log
  else
    COUPON_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/$CUPOM-$ORDEM.output | jq -r .id)
    echo -ne "`date +"%T.%3N"` - Importado $OPERACAO $ORDEM do cupom: $CUPOM e pdv: $NUM_PDV\n" >> $DIR_FILES/$CNPJ_FILIAL/importacao-`date +%Y-%m-%d`.log

    rm -f $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/$CUPOM-$ORDEM.output
    rm -f $JSON_FILE
  fi
}

function createCheckoutSalesTransactions() {
  COUPON_ID=$1
  CUPOM=$2

  TRANSACTIONS_CUPOM=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM /SELECT:OPERADOR','ORIGEM','CUPOM','DEBI_CRED','ORDEM','EMPCONV','NUMAUTORI','BINCARTAO','NSU','BANDEIRA','CNPJCRED','ESPECIE','CANCELADO','OBSERVACAO','DATA','HORARIO','CGCCPF','NOMECLI','VALOR','TIPODOC)
  echo "$TRANSACTIONS_CUPOM"| \
  while IFS='|' read -r OPERADOR ORIGEM CUPOM DEBI_CRED ORDEM EMPCONV NUMAUTORI BINCARTAO NSU BANDEIRA CNPJCRED ESPECIE CANCELADO OBSERVACAO DATA HORARIO CGCCPF NOMECLI VALOR TIPODOC; do
    CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$PDV-ID-API" | cut -d "=" -f2)
    CHECKOUT_ID_API=$(echo $CHECKOUT_ID_API| tr -d ' ')
    CUPOM=$(echo $CUPOM| tr -d ' ')
    NUM_PDV=$(echo $PDV| tr -d ' ')
    OPERADOR=$(echo $OPERADOR| tr -d ' ')
    STATUS=$(echo "${CANCELADO}"| tr -d ' ')
    ORIGEM=$(echo "${ORIGEM}"| tr -d ' ')
    DEBI_CRED=$(echo "${DEBI_CRED}"| tr -d ' ')
    ORDEM=$(echo "${ORDEM}"| tr -d ' ')
    EMPCONV=$(echo "${EMPCONV}"| tr -d ' ')
    NUMAUTORI=$(echo "${NUMAUTORI}"| tr -d ' ')
    BINCARTAO=$(echo "${BINCARTAO}"| tr -d ' ')
    NSU=$(echo "${NSU}"| tr -d ' ')
    BANDEIRA=$(echo "${BANDEIRA}"| tr -d ' ')
    CNPJCRED=$(echo "${CNPJCRED}"| tr -d ' ')
    ESPECIE=$(echo "${ESPECIE}"| tr -d ' ')
    DATA=$(echo ${DATA:0:4}-${DATA:4:2}-${DATA:6:2})
    CGCCPF=$(echo $CGCCPF| tr -d ' ')
    VALOR=$(echo $VALOR| tr -d ' ')
    TIPODOC=$(echo $TIPODOC| tr -d ' ')

    jo -p company_id=$COMPANY_ID \
    checkout_id=$CHECKOUT_ID_API \
    coupon_id=$COUPON_ID \
    operator=$OPERADOR \
    coupon=$CUPOM \
    type=$TIPODOC \
    sale_date="${DATA}" \
    cancellation_status=$CANCELADO \
    origin="$ORIGEM" \
    pay_type="$ESPECIE" \
    order=$ORDEM \
    covenant_company=$EMPCONV \
    authorization_number=$NUMAUTORI \
    bin_cart="$BINCARTAO" \
    nsu="$NSU" \
    card_banner="$BANDEIRA" \
    card_cnpj="$CNPJCRED" \
    note="$OBSERVACAO" \
    total=$VALOR > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/transactions-cupom-$CUPOM-$ORDEM.json

    JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/transactions-cupom-$CUPOM-$ORDEM.json"

	  httpAPIRequest 'checkouts/coupons/transactions' $JSON_FILE $CNPJ_FILIAL $DATA $NUM_PDV $CUPOM $ORDEM 'PAGAMENTO'
  done
}

function createCouponsProducts() {
  COUPON_ID=$1
  CUPOM=$2

  PRODUTOS_CUPOM=$(cdbflites ff$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:ncupom=$CUPOM /SELECT:CODPRO','QTDEVEND','TOTVEND','NUMECR','NCUPOM','HORARIO','DATA','CDMOTOFE','CANCELADO','ORDEM','STATUS','CLIENTE','VENDEDOR','OPERADOR','CODDEPTO','VASILHAME','MOTICANCEL','TURNO','SUPERVISOR','CODBARRA','PRECO2','DESCONTO','LANSAI','ORDEMNOTA','ALIQICM','CODBOMBA','ENCERRA','LOTE','HORAFINAL','CODPROCOMP','ORDEMCOMP','PRECOUNIT','COMISJADEF','PERCCOMIS','CODPROC','QTDEVENDC','TOTVENDC','ALIQICMC','CANCELADOC','PRECONOR','TIPOPRECO','TIPTRIB','ACREDESCIT','PONTOSDOTZ','VALORPROMC','QTDEPROMOC','MODELODOC','MOTIDESC','SERIENFCE','QTDECESPDV','VALREEMB','CODFORN','IDPROMO','QTDDESPRIN','ALIQFECOP','REDUICMS','BCICMS','NUMPED','CODPROM','CODEANTRIB','BCPIS','BCCOFINS','CODBENEF','MOTIDESC2 | tr -d ' ')

  echo "$PRODUTOS_CUPOM"| \
  while IFS='|' read -r CODPRO QTDEVEND TOTVEND NUMECR NCUPOM HORARIO DATA CDMOTOFE CANCELADO ORDEM STATUS CLIENTE VENDEDOR OPERADOR CODDEPTO VASILHAME MOTICANCEL TURNO SUPERVISOR CODBARRA PRECO2 DESCONTO LANSAI ORDEMNOTA ALIQICM CODBOMBA ENCERRA LOTE HORAFINAL CODPROCOMP ORDEMCOMP PRECOUNIT COMISJADEF PERCCOMIS CODPROC QTDEVENDC TOTVENDC ALIQICMC CANCELADOC PRECONOR TIPOPRECO TIPTRIB ACREDESCIT PONTOSDOTZ VALORPROMC QTDEPROMOC MODELODOC MOTIDESC SERIENFCE QTDECESPDV VALREEMB CODFORN IDPROMO QTDDESPRIN ALIQFECOP REDUICMS BCICMS NUMPED CODPROM CODEANTRIB BCPIS BCCOFINS CODBENEF MOTIDESC2; do
    CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$PDV-ID-API" | cut -d "=" -f2)
    CHECKOUT_ID_API=$(echo $CHECKOUT_ID_API| tr -d ' ')
    DATA=$(echo ${DATA:0:4}-${DATA:4:2}-${DATA:6:2})
    CANCELADO=$(echo "${CANCELADO}"| tr -d ' ')

    jo -p company_id=$COMPANY_ID \
    checkout_id=$CHECKOUT_ID_API \
    coupon_id=$COUPON_ID \
    coupon=$CUPOM \
    erp_product_id=$CODPRO \
    bar_code=$CODBARRA \
    quantity=$QTDEVEND \
    unit_price=$PRECOUNIT \
    discount=$DESCONTO \
    total_price=$TOTVEND \
    hour=$HORARIO \
    sale_date=$DATA \
    erp_offer_id=$CDMOTOFE \
    cancellation_type=$CANCELADO \
    order=$ORDEM \
    erp_customer_id=$CLIENTE \
    erp_seller_id=$VENDEDOR \
    operator=$OPERADOR \
    erp_department_id=$CODDEPTO \
    aliquot_icms=$ALIQICM \
    normal_price=$PRECONOR \
    type_price=$TIPOPRECO \
    type_taxation=$TIPTRIB \
    model_doc=$MODELODOC \
    motive_discount=$MOTIDESC \
    serie_nf=$SERIENFCE \
    erp_promo_id=$IDPROMO \
    erp_order_id=$NUMPED \
    bc_pis=$BCPIS \
    bc_cofins=$BCCOFINS > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/produto-cupom-$CUPOM-$ORDEM.json

    JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA_VENDA/produto-cupom-$CUPOM-$ORDEM.json"

    httpAPIRequest 'checkouts/coupons/products' $JSON_FILE $CNPJ_FILIAL $DATA_VENDA $NUM_PDV $CUPOM $ORDEM 'PRODUTO'
  done
}

function createCheckoutSales() {
  CNPJ_FILIAL=$1
  NUM_PDV=$2
  CUPOM=$3
  ORDEM=$4
  TIPODOC=$5

  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/config ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/config
  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA


  JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA_VENDA/cupom-$CUPOM-$ORDEM.json"

  httpAPIRequest 'checkouts/sales/coupons' $JSON_FILE $CNPJ_FILIAL $DATA_VENDA $NUM_PDV $CUPOM $ORDEM 'VENDA'

  if [ ! "${COUPON_ID_API}" == "null" ]; then
    jo -p coupon=$CUPOM > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA_VENDA/ultimo_cupom.json

    createCouponsProducts $COUPON_ID_API $CUPOM
    createCheckoutSalesTransactions $COUPON_ID_API $CUPOM
  fi
}


function readFIPDV() {
  cd $DIR_DBF

  #COD_FILIAIS=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /ORDER:codfil99 /SELECT:codfil99' | sed 's/^ *//g')

  for COD_FILIAL in ${COD_FILIAIS[@]}; do
    cd $DIR_DBF

    CNPJ_FILIAL=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /FILTER:codfil99=$COD_FILIAL /SELECT:CGCFIL99)
    PDVS=$(cdbflites tabpdv.dbf /TRIM:all /DELETED- /FILTER:filial=$COD_FILIAL /ORDER:numero /SELECT:numero /SORT:numero |sed 's/^ *//g' |sed 's/[^0-9]//g' |sed '/^$/d')
    COMPANY_ID=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "COMPANY-ID-API" | cut -d "=" -f2)

    if [[ -f $DIR_FILES/$CNPJ_FILIAL/processo.pid ]]; then
      PID_FILE=$(cat $DIR_FILES/$CNPJ_FILIAL/processo.pid)
      kill $PID_FILE

      echo $$ > $DIR_FILES/$CNPJ_FILIAL/processo.pid
    else
      echo $$ > $DIR_FILES/$CNPJ_FILIAL/processo.pid
    fi

    for PDV in ${PDVS}; do
      cd $DIR_DBF

      DADOS_PDV=$(cdbflites tabpdv.dbf /TRIM:all /DELETED- /FILTER:numero=$PDV /FILTER:filial=$COD_FILIAL \
      /SELECT:numero','datainativ
      )

      if [[ $COD_FILIAL -lt 10 ]]; then
        cd $DIR_DBF/comuni0$COD_FILIAL
      else
        cd $DIR_DBF/comuni$COD_FILIAL
      fi

      if [[ $PDV -lt 10 ]]; then
        PDV=0$PDV
      fi

      for DIA_MES in ${DIAS_MESES[@]}; do
        DATA_VENDA=$(echo ${ANO}-${DIA_MES:2:2}-${DIA_MES:0:2})

        if [[ -e fi$DIA_MES$PDV.dbf ]]; then
          if [[ -e $DIR_FILES/$CNPJ_FILIAL/pdv-$PDV/response/$DATA_VENDA/ultimo_cupom.json ]]; then
            ULTIMO_CUPOM=$(cat $DIR_FILES/$CNPJ_FILIAL/pdv-$PDV/response/$DATA_VENDA/ultimo_cupom.json | jq '.coupon')
            ULTIMO_CUPOM=$(echo $ULTIMO_CUPOM| tr -d ' ')

            if [[ -z ${ULTIMO_CUPOM} ]]; then
              ULTIMO_CUPOM=0
            fi

            #Envia os ultimos 5 cupons de venda
            if [[ $ULTIMO_CUPOM -ge 5 ]]; then
              ULTIMO_CUPOM=$(echo "$ULTIMO_CUPOM-5"| bc -l)
            else
              ULTIMO_CUPOM=0
            fi
          else
            ULTIMO_CUPOM=0
          fi

          if [[ ${REPROCESSAR} == true ]]; then
            ULTIMO_CUPOM=0
          fi

          DADOS_CUPOM=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom'>='$ULTIMO_CUPOM /FILTER:origem='VENDAS' /SELECT:OPERADOR','ORIGEM','CUPOM','DEBI_CRED','ORDEM','EMPCONV','NUMAUTORI','BINCARTAO','NSU','BANDEIRA','CNPJCRED','ESPECIE','CANCELADO','OBSERVACAO','DATA','HORARIO','CGCCPF','NOMECLI','VALOR','TIPODOC)
            echo "$DADOS_CUPOM"| \
            while IFS='|' read -r OPERADOR ORIGEM CUPOM DEBI_CRED ORDEM EMPCONV NUMAUTORI BINCARTAO NSU BANDEIRA CNPJCRED ESPECIE CANCELADO OBSERVACAO DATA HORARIO CGCCPF NOMECLI VALOR TIPODOC; do
            CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$PDV-ID-API" | cut -d "=" -f2)
            CHECKOUT_ID_API=$(echo $CHECKOUT_ID_API| tr -d ' ')
            CUPOM=$(echo $CUPOM| tr -d ' ')
            NUM_PDV=$(echo $PDV| tr -d ' ')
            OPERADOR=$(echo $OPERADOR| tr -d ' ')
            STATUS=$(echo "${CANCELADO}"| tr -d ' ')
            ORIGEM=$(echo "${ORIGEM}"| tr -d ' ')
            DEBI_CRED=$(echo "${DEBI_CRED}"| tr -d ' ')
            ORDEM=$(echo "${ORDEM}"| tr -d ' ')
            EMPCONV=$(echo "${EMPCONV}"| tr -d ' ')
            NUMAUTORI=$(echo "${NUMAUTORI}"| tr -d ' ')
            BINCARTAO=$(echo "${BINCARTAO}"| tr -d ' ')
            NSU=$(echo "${NSU}"| tr -d ' ')
            BANDEIRA=$(echo "${BANDEIRA}"| tr -d ' ')
            CNPJCRED=$(echo "${CNPJCRED}"| tr -d ' ')
            ESPECIE=$(echo "${ESPECIE}"| tr -d ' ')
            DATA=$(echo ${DATA:0:4}-${DATA:4:2}-${DATA:6:2})
            CGCCPF=$(echo $CGCCPF| tr -d ' ')
            VALOR=$(echo $VALOR| tr -d ' ')
            TIPODOC=$(echo $TIPODOC| tr -d ' ')
            VALOR_TOTAL=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM /FILTER:origem='VENDAS' /FILTER:debi_cred='C' /SUM:valor | tr -d ' ' | sed 's/ /|/g;s/.$//g')
            TROCO_TOTAL=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM /FILTER:origem='TROCO' /SUM:valor | tr -d ' ' | sed 's/ /|/g;s/.$//g')
            DESCONTO=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM FILTER:especie='DESCONTO' /FILTER:debi_cred='*' /SUM:valor | tr -d ' ' | sed 's/ /|/g;s/.$//g')

            if [[ ! ${DATA} == ${DATA_VENDA} ]]; then
              continue
            fi

            if [[ -z "${TROCO}" ]]; then
              TROCO=0
            fi

            TOTAL=$(echo "$VALOR_TOTAL-$TROCO_TOTAL"| bc -l)

            if [[ -z "${STATUS}" ]]; then
              STATUS='N'
            fi

            if [[ -z ${ORDEM} ]]; then
              ORDEM=1
            fi

            if [[ ! -z $COMPANY_ID ]] && [[ ! -z $CUPOM ]] && [[ ! -z $NUM_PDV ]]; then
              mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA
              jo -p company_id=$COMPANY_ID \
              checkout_id=$CHECKOUT_ID_API \
              operator=$OPERADOR \
              coupon=$CUPOM \
              type=$TIPODOC \
              origin="$ORIGEM" \
              status=$CANCELADO \
              sale_date="${DATA}" \
              time_start=$HORARIO \
              customer_cpf=$CGCCPF \
              customer_name="$NOMECLI" \
              total_discount=$DESCONTO \
              total_coupon=$TOTAL > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/cupom-$CUPOM-$ORDEM.json

              createCheckoutSales $CNPJ_FILIAL $NUM_PDV $CUPOM $ORDEM $TIPODOC
            else
              echo -ne "company_id: $COMPANY_ID, cupom: $CUPOM e pdv: $NUM_PDV invalidos.\n" >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
            fi
          done
        fi
      done
    done

    rm -f $DIR_FILES/$CNPJ_FILIAL/processo.pid
  done

  exit 0
}

readFIPDV $*
