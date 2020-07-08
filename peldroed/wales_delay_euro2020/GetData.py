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
SAMPLE_SPREADSHEET_ID = '1_c_7HmTBPhSoRx03Gaobh4TFJhtAEb9vT4udR60xIH0'
SAMPLE_RANGE_NAME = 'Sheet1!A2:F'


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
    
    Group = []
    Country = []
    GroupRank = []
    Link = []
    Qualified = []
    ColourCode = []

    if not values:
    	print('No data found.')
    else:
    	for row in values:
    		#print('%s, %s, ' % (row[0], row[3]))
    		Group.append(row[0])
    		Country.append(row[1])
    		GroupRank.append(row[2])
    		Link.append(row[3])
    		Qualified.append(row[4])
    		ColourCode.append(row[5])

    return Group, Country, GroupRank, Link, Qualified, ColourCode

def Country_Table(): 

	PlayerName = []
	minutes = []
	PlayerCountry = []
	Age = []

	with open('player_euro2020_qual.csv') as csvDataFile:
		csvReader = csv.reader(csvDataFile)
		next(csvDataFile)
		for row in csvReader:
			PlayerName.append(row[0])
			minutes.append(row[6])
			PlayerCountry.append(row[12])
			Age.append(row[2]) 
	Minutes = [0 if x == '' else x for x in minutes]
	Countrydic = {}
	Group, Country, GroupRank, Link, Qualified, ColourCode = get_google_sheet()
	for team in range(len(Country)):
		PlayerAge = []
		PlayerMinutes = []
		minutesXage = []
		count_all_23_under = 0
		count_featured_23_under = 0

		for player in range(len(PlayerName)):
			if PlayerCountry[player] == Country[team]:
				PlayerAge.append(float(Age[player]))
				PlayerMinutes.append(float(Minutes[player]))
				minutesXage.append(float(Age[player])*float(Minutes[player]))
				if int(Age[player]) < 24:
					count_all_23_under = count_all_23_under + 1
					if int(Minutes[player]) > 0:
						count_featured_23_under = count_featured_23_under + 1
		
		avg_age = sum(PlayerAge)/len(PlayerAge)
		weight_avg_age  = sum(minutesXage)/sum(PlayerMinutes)
		#nominator = (sum(PlayerAge*PlayerMinutes))
		#denominator  = sum(PlayerMinutes)
		
		print "Country: "+str(Country[team])
		#print weight_avg_age
		
		print "Average Age: "+str(avg_age)
		print "Weighted Average Age: "+str(weight_avg_age)
		print "All Players 23 years old and younger: "+str(count_all_23_under)
		print "Featured Players 23 years old and younger: "+str(count_featured_23_under)
		
		Countrydic[team] = {"Group": Group[team],
	                     "Country": Country[team],
	                     "GroupRank": GroupRank[team],
	                     "Link": Link[team],
	                     "Qualified": Qualified[team],
	                     "ColourCode": ColourCode[team],
	                     "AverageAge": avg_age,
	                     "WeightedAverageAge: ": weight_avg_age,
	                     "AllPlayers23": count_all_23_under,
	                     "FeaturedPlayers23": count_featured_23_under
	                     }
	df = pd.DataFrame.from_dict(data=Countrydic, orient='index')
	df.to_csv("country_euro2020_qual.csv", index = False, header=True, encoding = 'utf-8')
	

def fbrefScrape():

	Group, Country, GroupRank, Link, Qualified, ColourCode = get_google_sheet()

	browser =  webdriver.Chrome("/Users/jakehughes/Documents/PythonScripts/chromedriver")
	
	#Loop through teams in this seasons Champions League
	for team in range(len(Country)):
		print 'Writing stats for '+Country[team]
		#Write website url to scrape from.
		page = Link[team]

		browser.get(page)

		time.sleep(5)

		content = browser.page_source
		pageSoup = BeautifulSoup(''.join(content), 'lxml')

		#pageTree = requests.get(page, headers=headers)
		#pageSoup = BeautifulSoup(pageTree.text.replace('<!--', '').replace('-->', ''), 'html.parser')

		#Find first table - standard "stats"
		table = pageSoup.find("table", {"id": "stats_standard_10434"})
		#Get Player Name
		PlayerName = []
		#Find all players in standard table
		name = table.find_all("th", {"data-stat": "player"})
		#Extract names
		for i in name:
			if i.contents[0] == 'Player':
				continue
			else:
				try:
					PlayerName.append(i.contents[0].text)
				except:
					PlayerName.append(i.contents[0])
		

		#Extract other stats from standard table
		position = table.find_all("td", {"data-stat": "position"})
		Age = table.find_all("td", {"data-stat": "age"})
		MP = table.find_all("td", {"data-stat": "games"})
		Starts = table.find_all("td", {"data-stat": "games_starts"})
		Min = table.find_all("td", {"data-stat": "minutes"})
		Gls = table.find_all("td", {"data-stat": "goals"})
		Ast = table.find_all("td", {"data-stat": "assists"})
		PK = table.find_all("td", {"data-stat": "pens_made"})
		PKatt = table.find_all("td", {"data-stat": "pens_att"})
		CrdY = table.find_all("td", {"data-stat": "cards_yellow"})
		CrdR = table.find_all("td", {"data-stat": "cards_red"})
		#xG = table.find_all("td", {"data-stat": "xg"})
		#npxG = table.find_all("td", {"data-stat": "npxg"})
		#xA = table.find_all("td", {"data-stat": "xa"})

		print PlayerName
		
		
		#Create dictionary of stats
		PlayerDic = {}
		for i in range(len(PlayerName)):
			if PlayerName[i] == 'Squad Total':
				continue		
			else:
				PlayerDic[PlayerName[i]] = {"PlayerName":PlayerName[i],
										"Country": Country[team],
				 						"PlayerPos":position[i].text, 
				 						"PlayerAge": Age[i].text,
				 						"MatchesPlayed":MP[i].text,
				 						"Starts": Starts[i].text,
				 						"Minutes": Min[i].text,
				 						"Goals": Gls[i].text,
				 						"Assists": Ast[i].text,
				 						"PKScored": PK[i].text,
				 						"PKAttempts": PKatt[i].text,
				 						"YellowCards": CrdY[i].text,
				 						"RedCards": CrdY[i].text
				 						}
				 						
		df = pd.DataFrame.from_dict(data=PlayerDic, orient='index')

		if Country[team] == 'England':
			df.to_csv("player_euro2020_qual.csv", index = False, header=True, encoding = 'utf-8')
		else:
			df.to_csv("player_euro2020_qual.csv", mode = 'a', index = False, header=False, encoding = 'utf-8')
 

#fbrefScrape()
Country_Table()

