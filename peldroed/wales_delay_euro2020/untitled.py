# -*- coding: utf-8 -*-
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
SAMPLE_SPREADSHEET_ID = '1GAoC-Cs5CvCZbA7PySTzlFLpVAWQ33yAcrbXQdE-wbE'
SAMPLE_RANGE_NAME = 'Sheet1!A2:G'


def get_google_sheet():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                range=SAMPLE_RANGE_NAME).execute()
    values = result.get('values', [])
    #print values
    
    Stock = []
    Price = []
    Trend = []
    Acronym = []
    Assets = []
    Liabillities = []
    Ratio = []

    if not values:
    	print('No data found.')
    else:
    	for row in values:
    		#print('%s, %s, ' % (row[0], row[3]))
    		Stock.append(row[0])
    		Price.append(row[1])
    		Trend.append(row[2])
    		Acronym.append(row[3])
    		Assets.append(row[4])
    		Liabillities.append(row[5])
            Ratio.append(row[6])

    return Stock, Price, Trend, Acronym, Assets, Liabillities, Ratio

Stock, Price, Trend, Acronym, Assets, Liabillities, Ratio = get_google_sheet()

print Stock