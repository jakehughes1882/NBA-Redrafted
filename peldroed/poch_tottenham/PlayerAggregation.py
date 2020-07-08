import pandas as pd
import time
import csv
import os
import sys
import random
import glob as gl 
import pandas as pd
import numpy as np
import collections

def update_files():
	for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player1/*.csv'):
		#print file.split("/")[-1]
		filename = file.split("/")[-1]
		if os.path.exists('/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player2/'+filename):
			continue
		else:
			#os.system("cp "+file+" /Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player2/")
			print filename

def HarryKane():	
	Club = []
	PlayerAge = []
	PlayerName = []
	PlayerHref = []
	
	rownumber = 0
	for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_club1/*.csv'):
		with open(file) as csvDataFile:
			csvReader = csv.reader(csvDataFile)
			next(csvDataFile)
			for row in csvReader:
				Club.append(row[0])
				PlayerName.append(row[1])
				PlayerAge.append(row[2])
				PlayerHref.append(row[3])	
				
	playerstats = {}
	
	for Player in range(len(PlayerName)):
		if PlayerName[Player] == 'Dele Alli' or PlayerName[Player] == 'Harry Kane':	
			#if os.path.exists('/Users/jakehughes/Documents/PythonScripts/FootballCode/Bad_Tottenham/player_history/'+PlayerName[Player].replace(' ', '').replace("'", '')+'.csv'):
			if os.path.exists('/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player2/'+Club[Player].replace(' ', '').replace("'", '')+'-'+PlayerName[Player].replace(' ', '').replace("'", '')+'.csv'):		
				PlayerDataFile = '/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player2/'+Club[Player].replace(' ', '').replace("'", '')+'-'+PlayerName[Player].replace(' ', '').replace("'", '')+'.csv'
				
				player_history = pd.read_csv(PlayerDataFile, index_col='Season')
				player_history = player_history.drop_duplicates()
				player_history = player_history.drop('Total / Average')
				#rows_drop = []
				print PlayerName[Player]
				for i in player_history.index.tolist():
					if int(i[:4]) < 2015:
						try:
							player_history = player_history.drop(i)
						except:
							continue
				appearances = []	
				sub_apps = []
				if player_history['Goals'].dtype == 'object':
					player_history['goals'] = 0
					player_history['goals'] = player_history['Goals'].str.replace('\t','').replace('-', '0').astype('int64')
				else: 
					player_history['goals'] = player_history['Goals']
				
				#print player_history['Assits']
				if player_history['Assits'].dtype == 'object':
					player_history['assists'] = 0
					player_history['assists'] = player_history['Assits'].str.replace('\t','').replace('-', '0').astype('int64')
				else:
					player_history['assists'] = player_history['Assits']
				
				if player_history['MotM'].dtype == 'object':
					player_history['manofthematch'] = 0
					player_history['manofthematch'] = player_history['MotM'].str.replace('\t','').replace('-', '0').astype('int64')
				else:
					player_history['manofthematch'] = player_history['MotM']
				
				if player_history['YellowCards'].dtype == 'object':
					player_history['yellows'] = 0
					player_history['yellows'] = player_history['YellowCards'].str.replace('\t','').replace('-', '0').astype('int64')
				else:
					player_history['yellows'] = player_history['YellowCards']
					
				if player_history['RedCards'].dtype == 'object':
					player_history['reds'] = 0
					player_history['reds'] = player_history['RedCards'].str.replace('\t','').replace('-', '0').astype('int64')
				else: 
					player_history['reds'] = player_history['RedCards']
					
				if player_history['PassPercentage'].dtype == 'object':
					player_history['pp'] = 0
					player_history['pp'] = player_history['PassPercentage'].str.replace('\t','').replace('-', '0').astype('float64')
				else: 
					player_history['pp'] = player_history['PassPercentage']
					
				if player_history['AerielsWon'].dtype == 'object':
					player_history['aw'] = 0
					player_history['aw'] = player_history['AerielsWon'].str.replace('\t','').replace('-', '0').astype('float64')
				else: 
					player_history['aw'] = player_history['AerielsWon']
					
				if player_history['WSRating'].dtype == 'object':
					player_history['ws'] = 0
					player_history['ws'] = player_history['WSRating'].str.replace('\t','').replace('-', '0').astype('float64')
				else: 
					player_history['ws'] = player_history['WSRating']
					
				if player_history['ShotsPerGame'].dtype == 'object':
					player_history['SPG'] = 0
					player_history['SPG'] = player_history['ShotsPerGame'].str.replace('\t','').replace('-', '0').astype('float64')
				else: 
					player_history['SPG'] = player_history['ShotsPerGame']				
						
				for i in range(len(player_history)):	
					if player_history['Apps'].dtype == 'object':		
						if '(' in player_history['Apps'][i]:
							#print int(player_history['Apps'][i].split('(')[0])
							player_history['appearances'] = int(player_history['Apps'][i].split('(')[0])
							player_history['sub_apps'] = int(player_history['Apps'][i].split('(')[1].replace(')', ''))
					else:
						player_history['appearances'] = int(player_history['Apps'][i])	
				#print player_history
				#print player_history.index[:4]
				player_history['season'] = player_history.index
				player_history['seasonkey'] =  player_history['season'].str[:4]
				player_history = player_history.drop(['ShotsPerGame', 'Apps', 'MotM', 'RedCards', 'PassPercentage', 
													  'YellowCards', 'WSRating', 'AerielsWon', 'Goals', 'Assits'], axis=1)
				HarryKane = player_history[player_history['Team'] == 'Tottenham']
				HarryKanePL = HarryKane[HarryKane['Tournament'] == 'EPL']
				print HarryKanePL
				HarryKanePL.to_csv('DeleAlliPL.csv', index = False, header=True, encoding = 'utf-8')
				'''
				playerstats[player_history.index] = {'Player': PlayerName[Player], 'Player Age': PlayerAge[Player], 
				                       'CurrentClub': Club[Player], 'Minutes':player_history['Mins'], 
				                       'Appearances': appearances, 'AppearancesAsSub': sub_apps, 
				                       'Goals': player_history['goals'], 'Assists': player_history['assists'], 
				                       'MotM': player_history['manofthematch'], 
				                       'YellowCards': player_history['yellows'], 'RedCards': player_history['reds'], 
				                       'AerielsWon': player_history['aw'], 'ShotsPerGame': player_history['SPG'], 
				                       'PassingAccuracy':  player_history['pp'], "Rating": player_history['ws']}	
				'''                       			
	#Harry_Kane_df = pd.DataFrame.from_dict(data=playerstats, orient='index')
	#print Harry_Kane_df
	#for i in playerstats:
	#	print i


def player_file():	
	Club = []
	PlayerAge = []
	PlayerName = []
	PlayerHref = []
	
	rownumber = 0
	for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_club1/*.csv'):
		with open(file) as csvDataFile:
			csvReader = csv.reader(csvDataFile)
			next(csvDataFile)
			for row in csvReader:
				Club.append(row[0])
				PlayerName.append(row[1])
				PlayerAge.append(row[2])
				PlayerHref.append(row[3])	
				
	#print len(PlayerName)	
	playerstats = {}
	
	for Player in range(len(PlayerName)):	
		#if os.path.exists('/Users/jakehughes/Documents/PythonScripts/FootballCode/Bad_Tottenham/player_history/'+PlayerName[Player].replace(' ', '').replace("'", '')+'.csv'):
		if os.path.exists('/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player2/'+Club[Player].replace(' ', '').replace("'", '')+'-'+PlayerName[Player].replace(' ', '').replace("'", '')+'.csv'):		
			PlayerDataFile = '/Users/jakehughes/Documents/PythonScripts/FootballCode/bad_tottenham_player2/'+Club[Player].replace(' ', '').replace("'", '')+'-'+PlayerName[Player].replace(' ', '').replace("'", '')+'.csv'
			
			player_history = pd.read_csv(PlayerDataFile, index_col='Season')
			player_history = player_history.drop_duplicates()
			player_history = player_history.drop('Total / Average')
			#rows_drop = []
			print PlayerName[Player]
			for i in player_history.index.tolist():
				if int(i[:4]) < 2015:
					try:
						player_history = player_history.drop(i)
					except:
						continue
			appearances = []	
			sub_apps = []
			print player_history['PassPercentage']
			
			if player_history['Goals'].dtype == 'object':
				player_history['goals'] = 0
				player_history['goals'] = player_history['Goals'].str.replace('\t','').replace('-', '0').astype('int64')
			else: 
				player_history['goals'] = player_history['Goals']
			
			#print player_history['Assits']
			if player_history['Assits'].dtype == 'object':
				player_history['assists'] = 0
				player_history['assists'] = player_history['Assits'].str.replace('\t','').replace('-', '0').astype('int64')
			else:
				player_history['assists'] = player_history['Assits']
			
			if player_history['MotM'].dtype == 'object':
				player_history['manofthematch'] = 0
				player_history['manofthematch'] = player_history['MotM'].str.replace('\t','').replace('-', '0').astype('int64')
			else:
				player_history['manofthematch'] = player_history['MotM']
			
			if player_history['YellowCards'].dtype == 'object':
				player_history['yellows'] = 0
				player_history['yellows'] = player_history['YellowCards'].str.replace('\t','').replace('-', '0').astype('int64')
			else:
				player_history['yellows'] = player_history['YellowCards']
				
			if player_history['RedCards'].dtype == 'object':
				player_history['reds'] = 0
				player_history['reds'] = player_history['RedCards'].str.replace('\t','').replace('-', '0').astype('int64')
			else: 
				player_history['reds'] = player_history['RedCards']
				
			if player_history['PassPercentage'].dtype == 'object':
				player_history['pp'] = 0
				player_history['pp'] = player_history['PassPercentage'].str.replace('\t','').replace('-', '0').astype('float64')
				print player_history['pp'] 
			else: 
				player_history['pp'] = player_history['PassPercentage']
				
			if player_history['AerielsWon'].dtype == 'object':
				player_history['aw'] = 0
				player_history['aw'] = player_history['AerielsWon'].str.replace('\t','').replace('-', '0').astype('float64')
			else: 
				player_history['aw'] = player_history['AerielsWon']
				
			if player_history['WSRating'].dtype == 'object':
				player_history['ws'] = 0
				player_history['ws'] = player_history['WSRating'].str.replace('\t','').replace('-', '0').astype('float64')
			else: 
				player_history['ws'] = player_history['WSRating']
				
			if player_history['ShotsPerGame'].dtype == 'object':
				player_history['SPG'] = 0
				player_history['SPG'] = player_history['ShotsPerGame'].str.replace('\t','').replace('-', '0').astype('float64')
			else: 
				player_history['SPG'] = player_history['ShotsPerGame']				
					
			for i in range(len(player_history)):	
				if player_history['Apps'].dtype == 'object':		
					if '(' in player_history['Apps'][i]:
						#print int(player_history['Apps'][i].split('(')[0])
						appearances.append(int(player_history['Apps'][i].split('(')[0]))
						sub_apps.append(int(player_history['Apps'][i].split('(')[1].replace(')', '')))
				else:
					appearances.append((player_history['Apps'][i]))	
			player_history_sum = player_history.sum(axis = 0, skipna = True)	
			#print player_history
			player_history_avg = player_history.mean(axis = 0, skipna = True)	
			#print player_history_avg['PassPercentage']
			print player_history['pp']
			#print player_history_avg['WSRating']
			#print player_history_sum['assists']
			#print player_history_sum['manofthematch']
			#print player_history_sum['yellows']
			#print player_history_sum['reds']
			#print sum(appearances)
			#print sum(sub_apps)
			
			playerstats[Player] = {'Player': PlayerName[Player], 'Player Age': PlayerAge[Player], 'CurrentClub': Club[Player], 'Minutes':player_history_sum['Mins'], 'Appearances': sum(appearances), 'AppearancesAsSub': sum(sub_apps), 'Goals': player_history_sum['goals'], 'Assists': player_history_sum['assists'], 'MotM': player_history_sum['manofthematch'], 'YellowCards': player_history_sum['yellows'], 'RedCards': player_history_sum['reds'], 'AerielsWon': player_history_avg['aw'], 'ShotsPerGame': player_history_avg['SPG'], 'PassingAccuracy':  player_history_avg['pp'], "Rating": player_history_avg['ws']}
	
	
	pd.DataFrame.from_dict(data=playerstats, orient='index').to_csv('Player_stats_updated.csv', index = False, header=True, encoding = 'utf-8')		
	

	
def ClubAggregation():
	
	Clubs  = []
	Player = []
	Minutes = []
	with open('Player_stats_updated.csv') as csvDataFile:
			csvReader = csv.reader(csvDataFile)
			next(csvDataFile)
			for row in csvReader:
				Clubs.append(row[1])
				Player.append(row[-3])				
				Minutes.append(int(row[7]))
				
	Club_list = set(Clubs)
	
	Club_minute_stats = {} 

	PlayerList = {z[0]:list(z[1:]) for z in zip(Player,Player, Clubs,Minutes)}

	
	PlayerStats = pd.DataFrame.from_dict(data=PlayerList, orient='index', columns=['Player', 'Club', 'Minutes'])
	PlayerStats = PlayerStats.drop_duplicates(keep='first')
	#print PlayerStats

	Tottenham = PlayerStats[PlayerStats['Club'] == 'Tottenham']
	Tottenham = Tottenham.sort_values(by=['Minutes'], ascending=False)
	Tottenham.to_csv('Tottenham_Team_Minutes.csv', index = False, header=True, encoding = 'utf-8')	

	Liverpool = PlayerStats[PlayerStats['Club'] == 'Liverpool']
	Liverpool = Liverpool.sort_values(by=['Minutes'], ascending=False)
	Liverpool.to_csv('Liverpool_Team_Minutes.csv', index = False, header=True, encoding = 'utf-8')
	'''
	ClubStats = PlayerStats.groupby('Club').agg({'Minutes': ['sum', np.std]})
	#print ClubStats

	ClubStats11 = PlayerStats.groupby('Club')['Minutes'].nlargest(11)
	ClubStats11 = ClubStats11.groupby('Club').agg({'Minutes': ['sum']})
	
	#print ClubStats11

	Final_table = pd.merge(ClubStats, ClubStats11, on=['Club','Club'], how='inner', suffixes=('_Total','_11'))

	Final_table.to_csv('Team_minutes_stats_pandas.csv', index = True, header=False, encoding = 'utf-8')

	Preprod = pd.read_csv('Team_minutes_stats_pandas.csv', names=['Club', 'Club2', 'Total_Minutes', 'Minutes_Deviation', 'Total_Minutes_11'])
	
	Ready = Preprod.drop(['Club2'], axis=1)
	'''
	#Ready.to_csv('Team_minutes_stats_updated.csv', index = False, header=True, encoding = 'utf-8')		
			

			
#update_files()
#player_file()
ClubAggregation()
#HarryKane()
		