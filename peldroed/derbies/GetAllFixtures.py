# -*- coding: utf-8 -*-
#from selenium import webdriver
#from selenium.webdriver.common.by import By
#from selenium.webdriver.support.ui import WebDriverWait
#from selenium.webdriver.support import expected_conditions as EC
#from selenium.webdriver.chrome.options import Options 
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
from random import seed
from random import random

#----------------------------------------------------------------------
def all_games():
	for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/PremierLeague/*.csv'):
		#print file
		pl_games = pd.read_csv(file)
		pl_games = pl_games.drop(pl_games.columns[6:], axis=1)
		#for row in pl_games.rows:
		for index, row in pl_games.iterrows():
			print(row)
			if row['FTHG'] > row['FTAG']:
				print('Home Win')
			elif row['FTHG'] == row['FTAG']:
				print('Draw')
			else:
				print('Away Win')
		#print pl_games

def t201819_games():

	match_params = {}

	count = 0

	for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/PremierLeague/E0_1819.csv'):
		#print file
		pl_games = pd.read_csv(file)
		pl_games = pl_games.drop(pl_games.columns[6:], axis=1)
		#for row in pl_games.rows:
		for index, row in pl_games.iterrows():
			count  = count + 1

			outcome = []
			outcomestring = []

			if row['FTHG'] > row['FTAG']:
				outcome = 1
			elif row['FTHG'] == row['FTAG']:
				outcome = 0
			else:
				outcome = -1

			if row['FTHG'] > row['FTAG']:
				outcomestring = 'won'
			elif row['FTHG'] == row['FTAG']:
				outcomestring = 'drew'
			else:
				outcomestring = 'lost'

			derby_severity = 0	

			derby_rating = IsThisADerby(row['HomeTeam'], row['AwayTeam'])
			if 	derby_rating > 0:
				derby_severity = derby_rating


					

			match_params[count] = {'HomeTeam': row['HomeTeam'], 'AwayTeam': row['AwayTeam'], 
								   'Scoreline': str(row['FTHG']) + '-' + str(row['FTAG']), 
								   'Outcome': outcome, 'Result': outcomestring, 
								   'Date': row['Date'], 'DerbyFlag': derby_severity}

	pd.DataFrame.from_dict(data=match_params, orient='index').to_csv('PremierLeagueResultsGrid201819.csv', index = False, header=True, encoding = 'utf-8')	

def IsThisADerby(HomeTeam, AwayTeam): 
	
	rivals = pd.read_csv('/Users/jakehughes/Documents/PythonScripts/NBA/public/peldroed/derbies/Rivals.csv')

	#print(rivals['Team'])
	for i in range(len(rivals)):
		if HomeTeam == rivals['Team'][i] and AwayTeam == rivals['Rival'][i]:
			return rivals['Severity'][i]		

def all_results():

	match_params = {}

	count = 0

	for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/PremierLeague/*.csv'):
		#print file
		pl_games = pd.read_csv(file)
		#pl_games = pl_games.drop(pl_games.columns[6:], axis=1)
		#for row in pl_games.rows:
		for index, row in pl_games.iterrows():
			count  = count + 1

			outcome = []
			outcomestring = []

			if row['FTHG'] > row['FTAG']:
				outcome = 1
			elif row['FTHG'] == row['FTAG']:
				outcome = 0
			else:
				outcome = -1

			if row['FTHG'] > row['FTAG']:
				outcomestring = 'won'
			elif row['FTHG'] == row['FTAG']:
				outcomestring = 'drew'
			else:
				outcomestring = 'lost'

			derby_severity = 0
			derby_flag = 0	

			derby_rating = IsThisADerby(row['HomeTeam'], row['AwayTeam'])
			if 	derby_rating > 0:
				derby_severity = derby_rating
				derby_flag = 0.5	

			match_params[count] = {'HomeTeam': row['HomeTeam'], 'AwayTeam': row['AwayTeam'], 
								   'Scoreline': str(row['FTHG']) + '-' + str(row['FTAG']), 
								   'Outcome': outcome, 'Result': outcomestring, 
								   'Date': row['Date'], 'DerbyFlag': derby_severity, 
								   'HomeShots': row['HS'], 'AwayShots': row['AS'], 'TotalShots': (row['HS'] + row['AS']),
								   'HomeGoals': row['FTHG'], 'AwayGoals': row['FTAG'], 'TotalGoals': (row['FTHG'] + row['FTAG']), 
								   'HomeFouls': row['HF'], 'AwayFouls': row['AF'], 'TotalFouls': (row['HF'] + row['AF']),
								   'HomeYellow': row['HY'], 'AwayYellow': row['AY'], 'TotalYellow': (row['HY'] + row['AY']),
								   'HomeRed': row['HR'], 'AwayRed': row['AR'], 'TotalRed': (row['HR'] + row['AR']),
								   'xInitVal': ((random())*2)-1, 'yInitVal': ((random())*2)-1,
								   'xNewVal': outcome+((((random())*2)-1)*0.1), 'yNewVal': derby_flag+((((random())*2)-1)*0.1) }

	AllFixtures = pd.DataFrame.from_dict(data=match_params, orient='index')
	column_order = ['HomeTeam', 'AwayTeam', 'Scoreline', 'Outcome', 'Result', 'Date', 'DerbyFlag', 
	                'HomeShots', 'AwayShots', 'TotalShots', 'HomeGoals', 'AwayGoals', 'TotalGoals', 
	                'HomeFouls', 'AwayFouls', 'TotalFouls', 'HomeYellow', 'AwayYellow', 'TotalYellow', 
	                'HomeRed', 'AwayRed', 'TotalRed', 'xInitVal', 'yInitVal', 'xNewVal', 'yNewVal']

	AllFixtures[column_order].to_csv('PremierLeagueResults.csv', index = False, header=True, encoding = 'utf-8')
	
def Aggregator():

	teams = []

	rivalries = pd.read_csv('/Users/jakehughes/Documents/PythonScripts/NBA/public/peldroed/derbies/Rivals.csv')
	for i in range(len(rivalries)):
		teams.append(rivalries['Team'][i])
	
	dist_list = set(teams)

	home_dict = {}

	pl_games = pd.read_csv('/Users/jakehughes/Documents/PythonScripts/NBA/public/peldroed/derbies/PremierLeagueResults.csv')
	
	for team in dist_list:
		homegamesplayed = []
		homegameswon = []
		homederbygamesplayed = []
		homederbygameswon = []
		awaygamesplayed = []
		awaygameswon = []
		awayderbygamesplayed = []
		awayderbygameswon = []
		gamesplayed = []
		gameswon = []
		derbygamesplayed = []
		derbygameswon = []
		for index, row in pl_games.iterrows():	
			if team == row['HomeTeam']:
				homegamesplayed.append(row['Date'])
				gamesplayed.append(row['Date'])
				if row['Outcome'] == 1:
					homegameswon.append(row['Date'])
					gameswon.append(row['Date'])
				if row['DerbyFlag'] > 0:
					homederbygamesplayed.append(row['Date'])
					derbygamesplayed.append(row['Date'])
					if row['Outcome'] == 1:
						homederbygameswon.append(row['Date'])
						derbygameswon.append(row['Date'])		
			if team == row['AwayTeam']:			
				awaygamesplayed.append(row['Date'])
				gamesplayed.append(row['Date'])
				if row['Outcome'] == -1:
					awaygameswon.append(row['Date'])
					gameswon.append(row['Date'])
				if row['DerbyFlag'] > 0:
					awayderbygamesplayed.append(row['Date'])
					derbygamesplayed.append(row['Date'])
					if row['Outcome'] == -1:
						awayderbygameswon.append(row['Date'])
						derbygameswon.append(row['Date'])
			if len(homederbygamesplayed) > 0 and len(awayderbygamesplayed) > 0:					
				home_dict[team] = {"homegamesplayed":len(homegamesplayed), "homegameswon":len(homegameswon), "homederbygamesplayed":len(homederbygamesplayed), "homederbygameswon":len(homederbygameswon),
			                   "homegameswonperc": float(len(homegameswon))/float(len(homegamesplayed)), "homederbygameswonperc": float(len(homederbygameswon))/float(len(homederbygamesplayed)),
							   "awaygamesplayed":len(awaygamesplayed), "awaygameswon":len(awaygameswon), "awayderbygamesplayed":len(awayderbygamesplayed), "awayderbygameswon":len(awayderbygameswon),
							   "awaygameswonperc": float(len(awaygameswon))/float(len(awaygamesplayed)), "awayderbygameswonperc": float(len(awayderbygameswon))/float(len(awayderbygamesplayed)),
							   "gamesplayed":len(gamesplayed), "gameswon":len(gameswon), "derbygamesplayed":len(derbygamesplayed), "derbygameswon":len(derbygameswon), 
							   "gameswonperc": float(len(gameswon))/float(len(gamesplayed)), "derbygameswonperc": float(len(derbygameswon))/float(len(derbygamesplayed)),
							   "Team": team}
	
	AggFixtures = pd.DataFrame.from_dict(data=home_dict, orient='index')
	column_order = ['Team', "homegamesplayed", "homegameswon", "homederbygamesplayed", "homederbygameswon", "homegameswonperc", "homederbygameswonperc",
					"awaygamesplayed", "awaygameswon", "awayderbygamesplayed", "awayderbygameswon", "awaygameswonperc", "awayderbygameswonperc",
					"gamesplayed", "gameswon", "derbygamesplayed", "derbygameswon", "gameswonperc", "derbygameswonperc"]

	AggFixtures[column_order].to_csv('BestDerbyTeam.csv', index = False, header=True, encoding = 'utf-8')





#all_games()
#t201819_games()
#all_results()
Aggregator()

#Severity = IsThisADerby('Tottenham', 'Arsenal')
#print Severity