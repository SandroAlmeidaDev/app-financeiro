#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
BASE_URL='http://localhost:3333'

DIR_FILES="$HOME/vendas_pdvs"
DIR_DBF='/media/sandro/9864B34564B32542/cristal/ser'

[[ ! -d $DIR_FILES ]] && mkdir -p $DIR_FILES &>/dev/null

function createCheckout() {
  CNPJ_FILIAL=$1
  NUMERO_PDV=$2

  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/config ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/config &>/dev/null
  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response &>/dev/null

  JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/request/cadastro-pdv-$NUMERO_PDV.json"

	CHECKOUT=$(curl -s -X POST "$BASE_URL/checkouts" \
		-H "content-type: application/json" \
 		-d @$JSON_FILE
)

	CHECKOUT_ID_API=$(echo $CHECKOUT | jq -r '.id')

  if [ ! "${CHECKOUT_ID_API}" == "null" ]
    then
    echo -ne "$CHECKOUT" > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO_PDV/response/$CHECKOUT_ID_API.json
    echo -ne "CHECKOUT-$NUMERO_PDV-ID-API=$CHECKOUT_ID_API \n" >> "$DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini"
  fi
}

function readTabpdv() {
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

      echo "$DADOS_PDV"| while IFS='|' read -r NUMERO DATAINATIV; do
      DATAINATIV=$(echo $DATAINATIV| tr -d ' ')

      if [[ -z $DATAINATIV ]]; then
        STATUS='Ativo'
      else
        STATUS='Inativo'
      fi

      NUMERO=$(echo $NUMERO| tr -d ' ')
      CHECKOUT_ID_API=$(cat $DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini | grep "CHECKOUT-$NUMERO-ID-API" | cut -d "=" -f2)

      if [[ ! -z $COMPANY_ID ]]; then
        mkdir -p $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO/request

        jo -p company_id=$COMPANY_ID \
          number=$NUMERO \
          status="$STATUS" > $DIR_FILES/$CNPJ_FILIAL/pdv-$NUMERO/request/cadastro-pdv-$NUMERO.json

          createCheckout $CNPJ_FILIAL $NUMERO
      else
          echo -ne "O campo company_id nao pode ser nulo para PDV $NUMERO." >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
      fi
      done
    done
  done
}

readTabpdv





