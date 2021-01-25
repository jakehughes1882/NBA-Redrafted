# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options 

from bs4 import BeautifulSoup
from bs4 import Comment

import pandas as pd
import time
import csv
import os
import sys
import random
import glob as gl
import requests
import numpy as np

import pprint
import json

import re
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request



#https://fbref.com/en/squads/b1bbcad3/2021/s10434/Wales

#################################################################################################################################
#######################################                      Google credentials            ######################################
#################################################################################################################################

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SPREADSHEET_ID = '1pYcJE6dkcmA64sGj9eeyrA8xhOiuxkeowJhGj27NVPQ'
RANGE_NAME = 'Sheet1!A1:G'


def gsheet_api_check(SCOPES):
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    return creds

def pull_sheet_data(SCOPES,SPREADSHEET_ID,RANGE_NAME):
    creds = gsheet_api_check(SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    result = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=RANGE_NAME).execute()
    values = result.get('values', [])
    
    if not values:
        print('No data found.')
    else:
        rows = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                  range=RANGE_NAME).execute()
        data = rows.get('values')
        print("COMPLETE: Data copied")
        return data

def Scraping():
	data = pull_sheet_data(SCOPES,SPREADSHEET_ID,RANGE_NAME)
	df = pd.DataFrame(data[1:], columns=data[0])

	#print(df['Key'])
	for index, row in df.iterrows():
		print(row['Key'])


#Scraping()
def SinglePageScrape(Page):
	browser =  webdriver.Chrome("/Users/jakehughes/Documents/peldroed.io/public/peldroed/FPLChooser/chromedriver")

	browser.get(Page)

	time.sleep(5)

	content = browser.page_source

	pageSoup = BeautifulSoup(''.join(content), 'lxml')

	#table = pageSoup.find_all("table")
	table = pageSoup.find("table", {"id": "stats_passing_types_*"})

	print(table)
	






SinglePageScrape('https://fbref.com/en/squads/054efa67/Bayern-Munich-Stats')

'''
table:
passing: stats_passing_types_3248	
		 stats_passing_types_3232
		 stats_passing_types_3260
		 stats_passing_types_3243
		 stats_passing_types_3239
'''
