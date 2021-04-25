#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
BASE_URL='http://localhost:3333'

DIR_FILES="$HOME/vendas_pdvs"
DIR_DBF='/media/sandro/9864B34564B32542/cristal/ser'

ANOS='2019'
MESES='01 02 03 04 05 06 07 08 09 10 11 12'
DIAS_MESES='2703'

[[ ! -d $DIR_FILES ]] && mkdir -p $DIR_FILES &>/dev/null

function createCheckoutSales() {
  CNPJ_FILIAL=$1
  NUMERO_PDV=$2
  CUPOM=$3
  DATA_VENDA=$4

  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/config ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/config &>/dev/null
  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$DATA_VENDA ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$DATA_VENDA &>/dev/null


  JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/request/$DATA_VENDA/cupom-$CUPOM.json"

	COUPON=$(curl -s -X POST "$BASE_URL/checkouts/sales/coupons" \
		-H "content-type: application/json" \
 		-d @$JSON_FILE
  )

  COUPON_ID_API=$(echo $COUPON | jq -r '.id')

  if [ ! "${COUPON_ID_API}" == "null" ]; then
    echo -ne "$COUPON" > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$DATA_VENDA/$COUPON_ID_API.json

    #createCheckoutTransactions $COUPON_ID_API $CNPJ_FILIAL $NUMERO_PDV
  fi
}

function createCheckoutTransactions() {
  COUPON_ID_API=$1
  CNPJ_FILIAL=$2
  NUM_PDV=$3

  COMPANY_ID=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "COMPANY-ID-API" | cut -d "=" -f2)

  DADOS_CUPOM=$(cdbflites fi$DIA_MES$NUM_PDV.dbf /SELECT:OPERADOR','ORIGEM','CUPOM','DEBI_CRED','ESPECIE','CANCELADO','DATA','HORARIO','CGCCPF','NOMECLI','VALOR)
  echo "$DADOS_CUPOM"| \
  while IFS='|' read -r OPERADOR ORIGEM CUPOM DEBI_CRED ESPECIE CANCELADO DATA HORARIO CGCCPF NOMECLI VALOR; do
    CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$PDV-ID-API" | cut -d "=" -f2)
    CHECKOUT_ID_API=$(echo $CHECKOUT_ID_API| tr -d ' ')
    OPERADOR=$(echo $OPERADOR| tr -d ' ')
    STATUS=$(echo "${STATUS}"| tr -d ' ')
    ORIGEM=$(echo "${ORIGEM}"| tr -d ' ')
    DEBI_CRED=$(echo "${DEBI_CRED}"| tr -d ' ')
    ESPECIE=$(echo "${ESPECIE}"| tr -d ' ')
    DATA=$(echo ${DATA:0:4}-${DATA:4:2}-${DATA:6:2})
    VALOR=$(echo $VALOR| tr -d ' ')

    if [[ -z "${STATUS}" ]]; then
      STATUS='N'
    fi
    if [[ ! -z $COMPANY_ID ]] && [[ ! -z $COUPON_ID_API ]] && [[ ! -z $NUM_PDV ]]; then
      mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA
      jo -p company_id=$COMPANY_ID \
        checkout_id=$CHECKOUT_ID_API \
        operator=$OPERADOR \
        coupon_id=$COUPON_ID_API \
        type="$DEBI_CRED" \
        pay_type="$ESPECIE" \
        origin="$ORIGEM" \
        status=$CANCELADO \
        sale_date="${DATA}" \
        time_start=$HORARIO \
        total_coupon=$VALOR > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/transaction-cupom-$CUPOM.json

    else
      echo -ne "company_id: $COMPANY_ID, cupom: $CUPOM e pdv: $NUM_PDV invalidos.\n" >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
    fi
  done
}

function readFIPDV() {
  cd $DIR_DBF

  COD_FILIAIS=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /ORDER:codfil99 /SELECT:codfil99 | awk '{a=$0;printf "%s ",a,$0}' | sed 's/^ *//g')

  for COD_FILIAL in ${COD_FILIAIS[@]}; do
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

          DADOS_CUPOM=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:origem='VENDAS' /FILTER:debi_cred='C' /SELECT:OPERADOR','ORIGEM','CUPOM','DEBI_CRED','CANCELADO','DATA','HORARIO','CGCCPF','NOMECLI','VALOR)
            echo "$DADOS_CUPOM"| \
            while IFS='|' read -r OPERADOR ORIGEM CUPOM DEBI_CRED CANCELADO DATA HORARIO CGCCPF NOMECLI VALOR; do
            CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$PDV-ID-API" | cut -d "=" -f2)
            CHECKOUT_ID_API=$(echo $CHECKOUT_ID_API| tr -d ' ')
            CUPOM=$(echo $CUPOM| tr -d ' ')
            NUM_PDV=$(echo $PDV| tr -d ' ')
            OPERADOR=$(echo $OPERADOR| tr -d ' ')
            STATUS=$(echo "${STATUS}"| tr -d ' ')
            ORIGEM=$(echo "${ORIGEM}"| tr -d ' ')
            DEBI_CRED=$(echo "${DEBI_CRED}"| tr -d ' ')
            DATA=$(echo ${DATA:0:4}-${DATA:4:2}-${DATA:6:2})
            CGCCPF=$(echo $CGCCPF| tr -d ' ')
            VALOR=$(echo $VALOR| tr -d ' ')
            TROCO=$(cdbflites fi$DIA_MES$PDV.dbf /TRIM:all /DELETED- /FILTER:cupom=$CUPOM /FILTER:origem='TROCO' /FILTER:debi_cred='D' /SELECT:VALOR)

            if [[ -z "${TROCO}" ]]; then
              TROCO=0
            fi

            TOTAL=$(echo "$VALOR-$TROCO"| bc -l)

            if [[ -z "${STATUS}" ]]; then
              STATUS='N'
            fi

            if [[ ! -z $COMPANY_ID ]] && [[ ! -z $CUPOM ]] && [[ ! -z $NUM_PDV ]]; then
              mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA
              jo -p company_id=$COMPANY_ID \
                checkout_id=$CHECKOUT_ID_API \
                operator=$OPERADOR \
                coupon=$CUPOM \
                type="$DEBI_CRED" \
                origin="$ORIGEM" \
                status=$CANCELADO \
                sale_date="${DATA}" \
                time_start=$HORARIO \
                customer_cpf=$CGCCPF \
                customer_name="$NOMECLI" \
                total_coupon=$TOTAL > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUM_PDV/request/$DATA/cupom-$CUPOM.json

              createCheckoutSales $CNPJ_FILIAL $NUM_PDV $CUPOM $DATA
            else
              echo -ne "company_id: $COMPANY_ID, cupom: $CUPOM e pdv: $NUM_PDV invalidos.\n" >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
            fi
          done
        fi
      done
    done
  done
}

readFIPDV
