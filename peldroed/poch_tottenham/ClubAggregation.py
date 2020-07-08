import pandas as pd
import time
import csv
import numpy as np
import os
import sys
import random
import glob as gl 
import pandas as pd



file = '/Users/jakehughes/Documents/PythonScripts/FootballCode/Bad_Tottenham/PremierLeagueResults.csv'

Season = []
Position = []
Team_raw = []
Team = []
Played = []
Win = []
Draw = []
Lose = []
Points = []
				
with open(file) as csvDataFile:
	csvReader = csv.reader(csvDataFile)
	next(csvDataFile)
	for row in csvReader:
		Season.append(row[0])
		Position.append(row[1])
		Team.append(row[2])
		Played.append(row[3])
		Win.append(row[4])
		Draw.append(row[5])
		Lose.append(row[6])
		Points.append(row[10])	

#print(np.unique(Season))


Season_Player = []
Club_Player = []
PlayerName = []
Minutes = []

for file in gl.glob('/Users/jakehughes/Documents/PythonScripts/FootballCode/Bad_Tottenham/PremierLeagueFiles/EPL*.csv'):
	with open(file) as csvDataFile:
		csvReader = csv.reader(csvDataFile)
		next(csvDataFile)
		szn =  '20'+str(file.split("/")[-1].replace('EPL', '')[:2])+'/'+str(file.split("/")[-1].replace('EPL', '')[2:4])
		for row in csvReader:
			Season_Player.append(szn)
			Club_Player.append(row[1])
			PlayerName.append(row[0])
			Minutes.append(row[8])
			#PlayerHref.append(row[3])	

Season_Array = np.unique(Season_Player)

Team_Array = np.unique(Team)
Club_Array = np.unique(Club_Player)

for i in Club_Array:
	for j in range(len(Team)):
		if i in Team[j]:
			Team[j] = i		

count = 0	
playerlist = []
teamlist = []
seasonlist = []
minuteslist = []

num_of_players = []
Season_by_Season = {}



squad = {}
epl_results = {}
count = 0

ClubKey = []
ClubName = []
ClubSeason = []
ClubSquadSize = []
ClubSquadList = []
ClubSquadPreviousSeason = []
ClubSquadMinutes = []
ClubSquadMinutesList = []
ClubSquadMinutesPreviousSeason = []

for i in Club_Array:
	for j in Season_Array:
		for k in range(len(Club_Player)):
			if i == Club_Player[k]:
				if j == Season_Player[k]:
					#print Club_Player[k]
					#print Season_Player[k]
					playerlist.append(PlayerName[k])
					teamlist.append(Club_Player[k])
					seasonlist.append(Season_Player[k])
					minuteslist.append(int(Minutes[k]))
					
		#print playerlist
		if len(playerlist) > 0:
			#count  = count + 1
			#print len(playerlist)
			#print np.unique(teamlist)[0]
			#print np.unique(seasonlist)[0]
			#print playerlist
			ClubKey.append(np.unique(teamlist)[0] + '-' + np.unique(seasonlist)[0])
			ClubName.append(np.unique(teamlist)[0])
			ClubSeason.append(np.unique(seasonlist)[0])
			ClubSquadSize.append(len(playerlist))
			ClubSquadList.append(playerlist)
			ClubSquadMinutes.append(sum(minuteslist))
			ClubSquadMinutesList.append(minuteslist)
			
		#print Club_Player[k]
		#print Season_Player[k]
		playerlist = []	
		teamlist = []	
		seasonlist = []		
		minuteslist = []	
		
for i in range(len(ClubKey)):
	squad[ClubKey[i]] = {"Club":ClubName[i] , "Season": ClubSeason[i], "ClubSquadSize": ClubSquadSize[i], 
					"ClubSquadRetained": 0, "ClubSquadNew": 0, 
					"SquadMinutes": ClubSquadMinutes[i], "SquadMinutesRetained": 0, 
					"SquadMinutesNew": 0, "EPLPosition": 0, "EPLPts":0, 
					"EPLPosition_Difference":0, "EPLPoints_Difference": 0}	

	retained_list = []
	retained_minutes = []
	new_list = []
	new_minutes = []
	for j in range(len(ClubKey)):
		if ClubName[i] == ClubName[j]:
			if int(ClubSeason[i][:4]) == int(ClubSeason[j][:4])+1:
				print ClubName[i]
				#print ClubName[j]
				print ClubSeason[i]
				#print ClubSeason[j]
				print ClubSquadList[i]
				'''
				for k in range(len(ClubSquadList[i])):
					#print ClubSquadList[i][k]
					if ClubSquadList[i][k] in ClubSquadList[j]:
						retained_list.append(ClubSquadList[i][k])
						retained_minutes.append(int(ClubSquadMinutesList[i][k]))
					else:
						new_list.append(ClubSquadList[i][k])
						new_minutes.append(int(ClubSquadMinutesList[i][k]))
				squad[ClubKey[i]] = {"Club":ClubName[i] , "Season": ClubSeason[i], "ClubSquadSize": ClubSquadSize[i], 
					"ClubSquadRetained": len(retained_list), "ClubSquadNew": len(new_list), 
					"SquadMinutes": ClubSquadMinutes[i], "SquadMinutesRetained": sum(retained_minutes), 
					"SquadMinutesNew": sum(new_minutes), "EPLPosition": 0, "EPLPts":0, 
					"EPLPosition_Difference":0, "EPLPoints_Difference": 0}
				'''	
'''								
for i in range(len(Season)):
	#print Season[i]
	#print Team[i]
	#if i > 0:
		#print Season[i-1]
		#print Team[i-1]
	for k in squad:
		if squad[k]['Club'] == Team[i] and squad[k]['Season'] == Season[i]:
			#print squad[k]['Club']
			#print squad[k]['Season']
			#print Position[i]
			#print Points[i]
			squad[k]['EPLPosition'] = Position[i]
			squad[k]['EPLPts'] = Points[i]
			#print squad[k]['EPLPosition']
			#print squad[k]['EPLPts']

for i in range(len(ClubKey)):
	for j in range(len(ClubKey)):
		if ClubKey[i].split("-")[0] == ClubKey[j].split("-")[0] and int(ClubKey[i].split("-")[1][0:4]) == int(ClubKey[j].split("-")[1][0:4])-1:
			print ClubKey[i].split("-")[0]
			print int(ClubKey[i].split("-")[1][0:4])
			print squad[ClubKey[i]]['EPLPosition']
			print int(ClubKey[j].split("-")[1][0:4])
			print squad[ClubKey[j]]['EPLPosition']
			squad[ClubKey[j]]['EPLPosition_Difference'] = int(squad[ClubKey[j]]['EPLPosition']) - int(squad[ClubKey[i]]['EPLPosition'])
			squad[ClubKey[j]]['EPLPoints_Difference'] = int(squad[ClubKey[j]]['EPLPts']) - int(squad[ClubKey[i]]['EPLPts'])
	
SquadTable = pd.DataFrame.from_dict(data=squad, orient='index')

SquadTable = SquadTable[SquadTable['ClubSquadRetained']>0]

SquadTable.to_csv('Team_squad_and_results.csv', index = False, header=True, encoding = 'utf-8')	
'''








