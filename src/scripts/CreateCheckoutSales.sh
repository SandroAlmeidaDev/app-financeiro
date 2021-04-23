#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
BASE_URL='http://localhost:3333'

DIR_FILES="$HOME/vendas_pdvs"
DIR_DBF='/media/sandro/9864B34564B32542/cristal/ser'

[[ ! -d $DIR_FILES ]] && mkdir -p $DIR_FILES &>/dev/null

function createCheckoutSales() {
  CNPJ_FILIAL=$1
  NUMERO_PDV=$2
  CUPOM=$3

  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/config ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/config &>/dev/null

  JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/json/cupom-$CUPOM-pdv-$NUMERO_PDV.json"

	CHECKOUT=$(curl -s -X POST "$BASE_URL/checkouts/sales/coupons" \
		-H "content-type: application/json" \
 		-d @$JSON_FILE
  )
}

function readFiPdv() {
  cd $DIR_DBF

  COD_FILIAIS=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /ORDER:codfil99 /SELECT:codfil99 | awk '{a=$0;printf "%s ",a,$0}' | sed 's/^ *//g')

  for COD_FILIAL in ${COD_FILIAIS[@]}; do
    CNPJ_FILIAL=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /FILTER:codfil99=$COD_FILIAL /SELECT:CGCFIL99)
    PDVS=$(cdbflites tabpdv.dbf /TRIM:all /DELETED- /FILTER:filial=$COD_FILIAL /ORDER:numero /SELECT:numero /SORT:numero | awk '{a=$0;printf "%s ",a,$0}')
    COMPANY_ID=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "COMPANY-ID-API" | cut -d "=" -f2)

    for PDV in ${PDVS[@]}; do
      DADOS_PDV=$(cdbflites tabpdv.dbf /TRIM:all /DELETED- /FILTER:numero=$PDV /FILTER:filial=$COD_FILIAL \
      /SELECT:numero','datainativ
      )

      DIAS_MESES='2703'
      for DIA_MES in ${DIAS_MESES[@]}; do
        if [[ $COD_FILIAL -lt 10 ]]; then
          cd $DIR_DBF/comuni0$COD_FILIAL
        else
          cd $DIR_DBF/comuni$COD_FILIAL
        fi

        DADOS_CUPOM=$(cdbflites fi$DIA_MES$PDV.dbf /SELECT:NUMECR','OPERADOR','CUPOM','CANCELADO','DATA','HORARIO','CGCCPF','NOMECLI','VALOR)

        echo "$DADOS_CUPOM"| while IFS='|' read -r NUMECR OPERADOR CUPOM CANCELADO DATA HORARIO CGCCPF NOMECLI VALOR; do
          CUPOM=$(echo $CUPOM| tr -d ' ')
          NUMECR=$(echo $NUMECR| tr -d ' ')
          OPERADOR=$(echo $OPERADOR| tr -d ' ')
          STATUS=$(echo $STATUS| tr -d ' ')

          if [[ -z $STATUS ]]; then
            STATUS='N'
          fi

          VALOR=$(echo $VALOR| tr -d ' ')

          CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$NUMECR-ID-API" | cut -d "=" -f2)

          if [[ ! -z $COMPANY_ID ]]; then
            jo -p company_id=$COMPANY_ID \
            checkout_id=$CHECKOUT_ID_API \
            operator=$OPERADOR \
            coupon=$CUPOM \
            status=$CANCELADO \
            sale_date='2019-03-27' \
            time_start=$HORARIO \
            total_coupon=$VALOR > $DIR_FILES/$CNPJ_FILIAL/json/cupom-$CUPOM-pdv-$NUMECR.json
          else
            echo -ne "O campo company_id nao pode ser nulo para PDV $NUMECR." >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
          fi

          createCheckoutSales $CNPJ_FILIAL $NUMECR $CUPOM
        done
      done
    done
  done
}

readFiPdv
