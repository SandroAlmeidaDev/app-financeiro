#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
BASE_URL='http://localhost:9090'

DIR_FILES="$HOME/vendas_pdvs"
DIR_DBF='/media/sandro/9864B34564B32542/cristal/ser'

ANOS='2019 2020 2021'
MESES='01 02 03 04 05 06 07 08 09 10 11 12'
DIAS_MESES='2303 2403 2503'

[[ ! -d $DIR_FILES ]] && mkdir -p $DIR_FILES &>/dev/null

function createCheckoutSales() {
  CNPJ_FILIAL=$1
  NUMERO_PDV=$2
  CUPOM=$3
  DATA_VENDA=$4
  ORDEM=$5
  TIPODOC=$6

  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/config ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/config &>/dev/null
  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$DATA_VENDA ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$DATA_VENDA &>/dev/null


  JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/request/$DATA_VENDA/cupom-$CUPOM-$ORDEM.json"

	COUPON=$(curl -s -X POST "$BASE_URL/checkouts/sales/coupons" \
		-H "content-type: application/json" \
 		-d @$JSON_FILE
  )

  COUPON_ID_API=$(echo $COUPON | jq -r '.id')

  if [ ! "${COUPON_ID_API}" == "null" ]; then
    echo -ne "$COUPON" > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$DATA_VENDA/$COUPON_ID_API.json

    if [[ ! "${TIPODOC}" == "CN" ]] && [[ ! -z $TIPODOC ]]; then
      createCheckoutSalesTransactions $COUPON_ID_API $CUPOM
      createCouponsProducts $COUPON_ID_API $CUPOM
    fi
  fi
}


function readFIPDV() {
  cd $DIR_DBF

  COD_FILIAIS=$*


  #COD_FILIAIS=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /ORDER:codfil99 /SELECT:codfil99 | awk '{a=$0;printf "%s ",a,$0}' | sed 's/^ *//g')

  for COD_FILIAL in ${COD_FILIAIS[@]}; do
    cd $DIR_DBF

    CNPJ_FILIAL=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /FILTER:codfil99=$COD_FILIAL /SELECT:CGCFIL99)
    PDVS=$(cdbflites tabpdv.dbf /TRIM:all /DELETED- /FILTER:filial=$COD_FILIAL /ORDER:numero /SELECT:numero /SORT:numero | awk '{a=$0;printf "%s ",a,$0}')
    COMPANY_ID=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "COMPANY-ID-API" | cut -d "=" -f2)

    for PDV in ${PDVS[@]}; do
      cd $DIR_DBF

      DADOS_PDV=$(cdbflites tabpdv.dbf /TRIM:all /DELETED- /FILTER:numero=$PDV /FILTER:filial=$COD_FILIAL \
      /SELECT:numero','datainativ
      )

      if [[ $COD_FILIAL -lt 10 ]]; then
        cd $DIR_DBF/comuni0$COD_FILIAL
      else
        cd $DIR_DBF/comuni$COD_FILIAL
      fi

      for DIA_MES in ${DIAS_MESES[@]}; do
        if [[ -e fi$DIA_MES$PDV.dbf ]]; then

          DADOS_CUPOM=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:origem='VENDAS' /SELECT:OPERADOR','ORIGEM','CUPOM','DEBI_CRED','ORDEM','EMPCONV','NUMAUTORI','BINCARTAO','NSU','BANDEIRA','CNPJCRED','ESPECIE','CANCELADO','OBSERVACAO','DATA','HORARIO','CGCCPF','NOMECLI','VALOR','TIPODOC)
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
            TROCO_TOTAL=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM /FILTER:debi_cred='D' /SUM:valor | tr -d ' ' | sed 's/ /|/g;s/.$//g')
            DESCONTO=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM FILTER:especie='DESCONTO' /FILTER:debi_cred='*' /SUM:valor | tr -d ' ' | sed 's/ /|/g;s/.$//g')

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

              createCheckoutSales $CNPJ_FILIAL $NUM_PDV $CUPOM $DATA $ORDEM $TIPODOC

              function createCheckoutSalesTransactions() {
                COUPON_ID_API=$1
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
                  coupon_id=$COUPON_ID_API \
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

	                TRANSACTION_COUPON=$(curl -s -X POST "$BASE_URL/checkouts/coupons/transactions" \
		                                    -H "content-type: application/json" \
 		                                    -d @$JSON_FILE
                                      )
                  TRANSACTION_COUPON_ID_API=$(echo $TRANSACTION_COUPON | jq -r '.id')

                  if [ ! "${TRANSACTION_COUPON_ID_API}" == "null" ]; then
                    echo -ne "$TRANSACTION_COUPON" > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/response/$DATA/$TRANSACTION_COUPON_ID_API.json
                  fi
                done
              }

              function createCouponsProducts() {
                COUPON_ID_API=$1
                CUPOM=$2

                PRODUTOS_CUPOM=$(cdbflites ff$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:ncupom=$CUPOM /SELECT:CODPRO','QTDEVEND','TOTVEND','NUMECR','NCUPOM','HORARIO','DATA','CDMOTOFE','CANCELADO','ORDEM','STATUS','CLIENTE','VENDEDOR','OPERADOR','CODDEPTO','VASILHAME','MOTICANCEL','TURNO','SUPERVISOR','CODBARRA','PRECO2','DESCONTO','LANSAI','ORDEMNOTA','ALIQICM','CODBOMBA','ENCERRA','LOTE','HORAFINAL','CODPROCOMP','ORDEMCOMP','PRECOUNIT','COMISJADEF','PERCCOMIS','CODPROC','QTDEVENDC','TOTVENDC','ALIQICMC','CANCELADOC','PRECONOR','TIPOPRECO','TIPTRIB','ACREDESCIT','PONTOSDOTZ','VALORPROMC','QTDEPROMOC','MODELODOC','MOTIDESC','SERIENFCE','QTDECESPDV','VALREEMB','CODFORN','IDPROMO','QTDDESPRIN','ALIQFECOP','REDUICMS','BCICMS','NUMPED','CODPROM','CODEANTRIB','BCPIS','BCCOFINS','CODBENEF','MOTIDESC2 | tr -d ' ')

                echo "$PRODUTOS_CUPOM"| \
                while IFS='|' read -r CODPRO QTDEVEND TOTVEND NUMECR NCUPOM HORARIO DATA CDMOTOFE CANCELADO ORDEM STATUS CLIENTE VENDEDOR OPERADOR CODDEPTO VASILHAME MOTICANCEL TURNO SUPERVISOR CODBARRA PRECO2 DESCONTO LANSAI ORDEMNOTA ALIQICM CODBOMBA ENCERRA LOTE HORAFINAL CODPROCOMP ORDEMCOMP PRECOUNIT COMISJADEF PERCCOMIS CODPROC QTDEVENDC TOTVENDC ALIQICMC CANCELADOC PRECONOR TIPOPRECO TIPTRIB ACREDESCIT PONTOSDOTZ VALORPROMC QTDEPROMOC MODELODOC MOTIDESC SERIENFCE QTDECESPDV VALREEMB CODFORN IDPROMO QTDDESPRIN ALIQFECOP REDUICMS BCICMS NUMPED CODPROM CODEANTRIB BCPIS BCCOFINS CODBENEF MOTIDESC2; do
                  CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$PDV-ID-API" | cut -d "=" -f2)
                  CHECKOUT_ID_API=$(echo $CHECKOUT_ID_API| tr -d ' ')
                  DATA=$(echo ${DATA:0:4}-${DATA:4:2}-${DATA:6:2})

                  jo -p company_id=$COMPANY_ID \
                  checkout_id=$CHECKOUT_ID_API \
                  coupon_id=$COUPON_ID_API \
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
                  is_canceled=$CANCELADO \
                  order=$ORDEM \
                  erp_customer_id=$CLIENTE \
                  erp_seller_id=$VENDEDOR \
                  operator=$OPERADOR \
                  erp_department_id=$CODDEPTO \
                  aliquot_icms=$ALIQICM \
                  normal_price=$PR \
                  type_price=$PRECONOR \
                  type_taxation=$TIPTRIB \
                  model_doc=$MODELODOC \
                  motive_discount=$MOTIDESC \
                  serie_nf=$SERIENFCE \
                  erp_promo_id=$IDPROMO \
                  erp_order_id=$NUMPED \
                  bc_pis=$BCPIS \
                  bc_cofins=$BCCOFINS > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/produto-cupom-$CUPOM-$ORDEM.json
                done
              }
            else
              echo -ne "company_id: $COMPANY_ID, cupom: $CUPOM e pdv: $NUM_PDV invalidos.\n" >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
            fi
          done
        fi
      done
    done
  done
}

readFIPDV $*


