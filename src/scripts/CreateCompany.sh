#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
export BASE_URL='http://localhost:3333'

export DIR_FILES="$HOME/vendas_pdvs"
export DIR_DBF='/media/sandro/9864B34564B32542/cristal/ser'

[[ ! -d $DIR_FILES ]] && mkdir -p $DIR_FILES &>/dev/null

function createCompany() {
  CNPJ_FILIAL=$1
  COD_FILIAL=$2

  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/config ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/config &>/dev/null
  [[ ! -d $DIR_FILES/$CNPJ_FILIAL/response ]] && mkdir -p $DIR_FILES/$CNPJ_FILIAL/response &>/dev/null

  JSON_FILE="$DIR_FILES/$CNPJ_FILIAL/request/cadastro-filial-$CNPJ_FILIAL.json"

	COMPANY=$(curl -s -X POST "$BASE_URL/companies" \
		-H "content-type: application/json" \
 		-d @$JSON_FILE
  )

	COMPANY_ID=$(echo $COMPANY | jq -r '.id')

  if [ ! "${COMPANY_ID}" == "null" ]
    then
    rm -f $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log

    echo -ne "$COMPANY" > $DIR_FILES/$CNPJ_FILIAL/response/$COMPANY_ID.json

    echo -ne "COMPANY-CODE-API=$COD_FILIAL \n" > "$DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini"
    echo -ne "COMPANY-CNPJ-API=$CNPJ_FILIAL \n" >> "$DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini"
    echo -ne "COMPANY-ID-API=$COMPANY_ID \n" >> "$DIR_FILES/$CNPJ_FILIAL/config/config-api-filial-$CNPJ_FILIAL.ini"
  else
    echo -ne "O campo company_id nao pode ser nulo para filial $COD_FILIAL." >> $DIR_FILES/$CGCFIL99/error-`date +%Y-%m-%d`.log
  fi
}

function readCadfil() {
  cd $DIR_DBF

  export COD_FILIAIS=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /ORDER:codfil99 /SELECT:codfil99 | awk '{a=$0;printf "%s ",a,$0}' | sed 's/^ *//g')

  for COD_FILIAL in ${COD_FILIAIS[@]}; do
    DADOS_FILIAL=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /FILTER:codfil99="$COD_FILIAL" \
      /SELECT:CGCFIL99','CODFIL99','INSCFIL99','RAZSOC99','APELIDO99','ENDFIL99','NUMERFIL99','BAIRRO99','CEPFIL99','FONEFIL99','EMAIL99
    )



    echo "$DADOS_FILIAL"| while IFS='|' read -r CGCFIL99 CODFIL99 INSCFIL99 RAZSOC99 APELIDO99 ENDFIL99 NUMERFIL99 BAIRRO99 CEPFIL99 FONEFIL99 EMAIL99; do
      mkdir -p $DIR_FILES/$CGCFIL99/request &>/dev/null

      jo -p cnpj=$CGCFIL99 company_code=$(echo $CODFIL99| tr -d ' ') \
      state_registration="$INSCFIL99" company_name="$RAZSOC99" \
      fantasy_name="$APELIDO99" adress="$ENDFIL99" number="$NUMERFIL99" \
      district="$BAIRRO99" zip_code="$CEPFIL99" commercial_phone="$FONEFIL99" \
      email="$EMAIL99" company_type='FILIAL' > $DIR_FILES/$CGCFIL99/request/cadastro-filial-$CGCFIL99.json

      createCompany $CGCFIL99 $CODFIL99
    done
  done
}

readCadfil





