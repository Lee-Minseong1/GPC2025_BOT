import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MAIMAI_FILE = os.path.join(BASE_DIR, 'maimai.xlsx')  
SVDX_FILE = os.path.join(BASE_DIR, 'svdx.xlsx')      

OUTPUT_FILE_MAIMAI = os.path.join(BASE_DIR, 'maimai.csv')         
OUTPUT_FILE_SVDX = os.path.join(BASE_DIR, 'svdx.csv')               
TOP100_MAIMAI_FILE = os.path.join(BASE_DIR, 'maimai_top100.csv')     
TOP100_SVDX_FILE = os.path.join(BASE_DIR, 'svdx_top100.csv')        

maimai_data = pd.read_excel(MAIMAI_FILE, engine='openpyxl') 
maimai_data['rating'] = pd.to_numeric(maimai_data['rating'], errors='coerce') 
maimai_data_sorted = maimai_data.sort_values(by='rating', ascending=False)
maimai_top100 = maimai_data_sorted.head(100)

maimai_data.to_csv(OUTPUT_FILE_MAIMAI, index=False, encoding='utf-8-sig')
maimai_top100.to_csv(TOP100_MAIMAI_FILE, index=False, encoding='utf-8-sig')
print(f"maimai.xlsx → '{OUTPUT_FILE_MAIMAI}' 변환 완료")
print(f"maimai 상위 100명 → '{TOP100_MAIMAI_FILE}' 저장 완료")

svdx_data = pd.read_excel(SVDX_FILE, engine='openpyxl')

svdx_data['rating'] = pd.to_numeric(svdx_data['rating'], errors='coerce') 
svdx_data_sorted = svdx_data.sort_values(by='rating', ascending=False)
svdx_top100 = svdx_data_sorted.head(150)

svdx_data.to_csv(OUTPUT_FILE_SVDX, index=False, encoding='utf-8-sig') 

svdx_top100.to_csv(TOP100_SVDX_FILE, index=False, encoding='utf-8-sig')
print(f"svdx.xlsx → '{OUTPUT_FILE_SVDX}' 변환 완료!")
print(f"svdx 상위 100명 → '{TOP100_SVDX_FILE}' 저장 완료!")
