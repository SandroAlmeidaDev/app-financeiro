#!/bin/bash
export PATH=$PATH:$HOME/sgup/bin:/sbin:/bin
DIR_DBF='/media/sandro/9864B34564B32542/cristal/ser'
BASE_URL='http://localhost:3333'

function createCompany() {
  JSON_FILE="$1.json"

	COMPANY=$(curl -s -X POST "$BASE_URL/companies" \
		-H "content-type: application/json" \
 		-d @$JSON_FILE
)

	COMPANY_ID=$(echo $COMPANY | jq -r '.id')

  if [ ! "$COMPANY_ID" == "null" ]
    then
    echo -ne "COMPANY_CNPJ_API=$1 \n" > "$HOME/.config_api_filial.ini"
    echo -ne "COMPANY_ID_API=$COMPANY_ID \n" >> "$HOME/.config_api_filial.ini"
  fi
}

cd $DIR_DBF

COD_FILIAIS=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /ORDER:codfil99 /SELECT:codfil99 | awk '{a=$0;printf "%s ",a,$0}' | sed 's/^ *//g')

for COD_FILIAL in ${COD_FILIAIS[@]}; do
  DADOS_FILIAL=$(cdbflites cadfil.dbf /TRIM:all /DELETED- /FILTER:codfil99="$COD_FILIAL" \
  /SELECT:CGCFIL99','CODFIL99','INSCFIL99','RAZSOC99','APELIDO99','ENDFIL99','NUMERFIL99','BAIRRO99','CEPFIL99','FONEFIL99','EMAIL99
  )

  echo "$DADOS_FILIAL"| while IFS='|' read -r CGCFIL99 CODFIL99 INSCFIL99 RAZSOC99 APELIDO99 ENDFIL99 NUMERFIL99 BAIRRO99 CEPFIL99 FONEFIL99 EMAIL99; do
    jo -p cnpj=$CGCFIL99 company_code=$(echo $CODFIL99| tr -d ' ') \
    state_registration="$INSCFIL99" comapany_name="$RAZSOC99" \
    fantasy_name="$APELIDO99" adress="$ENDFIL99" number="$NUMERFIL99" \
    district="$BAIRRO99" zip_code="$CEPFIL99" commercial_phone="$FONEFIL99" \
    email="$EMAIL99" company_type='FILIAL' > $CGCFIL99.json

    createCompany $CGCFIL99
  done
done





