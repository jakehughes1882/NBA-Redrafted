import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options 
from bs4 import BeautifulSoup
import pandas as pd
import sys
import os
import time
import re
import glob

headers = {'User-Agent': 
           'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'}

def get_player_list(years: int) -> dict:

	player_dic = {}

	for i in range(years):
		url = 'https://www.basketball-reference.com/leagues/NBA_%s_per_game.html' % (2020-i)
		pageTree = requests.get(url, headers=headers)
		pageSoup = BeautifulSoup(pageTree.content, 'html.parser')
		PlayerList = pageSoup.find_all('td', {"data-stat" : "player"})
		for player in PlayerList:
			for items in player:
				try:
					player_dic[items.get('href')[11:-5]] = {"PlayerName": items.text, "PlayerLink": items.get('href')}
				except:
					continue

	return player_dic
	

def get_tables(player: dict) -> list:
	#Player URL to find stats
	url = 'https://www.basketball-reference.com/'+player['PlayerLink']
	#Creating browser as to bypass controls used by website to grab all tables.
	#Some tables are commented out when the website detects a browserless scraper.
	chrome_options = Options()
	chrome_options.add_argument("--headless")
	chrome_options.add_argument("--window-size=1920x1080")
	browser =  webdriver.Chrome(options = chrome_options, executable_path="/Users/jakehughes/Documents/peldroed.io/public/pelfasged/NBA_price_per_point/chromedriver")
	browser.get(url)
	time.sleep(2)
	content = browser.page_source
	soup = BeautifulSoup(''.join(content), 'lxml')

	table_list = ['per_game', 'advanced', 'playoffs_per_game', 'playoffs_advanced', 'all_salaries']

	tables = []

	for i in table_list:
		try:
			table = soup.find('table', {"id" : i})
			df = pd.read_html(table.prettify(), flavor='bs4')[0]
			tables.append(df)
		except:
			continue

	#print(len(tables))
	#for i in tables:
	#	print(i)
	current_contract = soup.find_all('table')
	player_current_contract = pd.read_html(current_contract[-1].prettify(), flavor='bs4')

	tables.append(player_current_contract[0])

	browser.quit()

	print(len(tables))

	return tables



	#return tables

'''
def get_contract(player: dict):
	print(player['PlayerName'])
	url = 'https://www.basketball-reference.com/'+player['PlayerLink']
	#list_of_teams = []
	pageTree = requests.get(url, headers=headers)
	pageSoup = BeautifulSoup(pageTree.content, 'html.parser')
	tables = pageSoup.find("table", {"id" : "contracts_okc"})
	#print(tables[0])
	#print(tables)
'''

def main():
	table_list_with_playoffs = ['per_game', 'advanced', 'playoffs_per_game', 'playoffs_advanced', 'all_salaries', 'current_contract']
	table_list_without_playoffs = ['per_game', 'advanced', 'all_salaries', 'current_contract']

	dic = get_player_list(10)
	
	for i in dic:
		try:
			print(dic[i]["PlayerName"])
			price_and_points(dic[i]["PlayerName"])
		except:
			continue
		#print("~/Documents/data/basketball_reference/"+dic[i]["PlayerName"].replace(" ", "_")+"_"+table_list[0]+".csv")
		#if dic[i]["PlayerName"] in players_scraped:\
		if os.path.exists("/Users/jakehughes/Documents/data/basketball_reference/"+dic[i]["PlayerName"].replace(" ", "_")+"_"+table_list_with_playoffs[0]+".csv"):
			print(dic[i]["PlayerName"]+' profile scraped')
		else:
			tables = get_tables(dic[i])
			if len(tables) == 4:
				tablenames = table_list_without_playoffs
			else:
				tablenames = table_list_with_playoffs
			for j in range(len(tables)):
				df = tables[j]
				df.to_csv("~/Documents/data/basketball_reference/"+dic[i]["PlayerName"].replace(" ", "_")+"_"+tablenames[j]+".csv", index = False, header=True, encoding = 'utf-8')
		

	
	
	#for i in dic:
	#	print(dic[i]["PlayerName"])

def price_and_points(playername):

	per_game_df = pd.read_csv("/Users/jakehughes/Documents/data/basketball_reference/"+playername.replace(" ", "_")+"_per_game.csv")
	per_game_df = remove_summary_seasons(per_game_df)
	per_game_df = per_game_df.drop(['FG', 'FGA', 'FG%', 'eFG%', 'FT', 'FTA', 'FT%', 'TOV', 'PF'], 1)
	
	advanced_df = pd.read_csv("/Users/jakehughes/Documents/data/basketball_reference/"+playername.replace(" ", "_")+"_advanced.csv")
	advanced_df = remove_summary_seasons(advanced_df)
	advanced_df = advanced_df.drop(['Age', 'Season', 'Tm', 'Lg', 'Pos', 'G', 'MP', 'PER', '3PAr',
       'FTr', 'ORB%', 'DRB%', 'TRB%', 'AST%', 'STL%', 'BLK%', 'TOV%', 'USG%',
       'Unnamed: 19', 'OWS', 'DWS', 'WS', 'WS/48', 'Unnamed: 24', 'OBPM',
       'DBPM'], 1)

	all_salaries_df = pd.read_csv("/Users/jakehughes/Documents/data/basketball_reference/"+playername.replace(" ", "_")+"_all_salaries.csv") 
	all_salaries_df = remove_summary_seasons(all_salaries_df)
	all_salaries_df = all_salaries_df.drop(['Lg'], 1)

	result = pd.concat([per_game_df, advanced_df], axis=1).reindex(per_game_df.index)

	#print(result)
	#print(all_salaries_df)

	#new_df = pd.concat([result, all_salaries_df], axis=1, on='Season', how='left')
	new_df = pd.merge(result, all_salaries_df, how='left', on=['Season'])
	print(new_df)
	new_df.to_csv("/Users/jakehughes/Documents/data/basketball_reference/player_dollar/"+playername.replace(" ", "_")+".csv")

def remove_summary_seasons(df):
	indexNames = df[ df['Season'].str.contains('-') == False ].index
	NaNrows = df[ df['Season'].isnull() ].index
	df = df.drop(indexNames)
	df = df.drop(NaNrows)
	return df

def collate_players_and_seasons():
	path = '/Users/jakehughes/Documents/data/basketball_reference/player_dollar/'
	all_files = glob.glob(path + "*.csv")

	li = []

	for filename in all_files:
		df = pd.read_csv(filename, index_col=None, header=0)
		file = filename.replace(path, '')
		file = file.replace('.csv', '')
		file = file.replace('_', ' ')
		df['PlayerName'] = file
		#g = df.groupby('Season')
		#g['data1'].rank(method='min')
		#df['RN'] = g['data1'].rank(method='min')
		#df['RN'] = df.sort_values(['Season'], ascending=[True]) \
		#	.groupby(['PlayerName', ]) \
		#	.cumcount() + 1
		df['year'] = df['Season'].str[:4]
		df["year"] = pd.to_numeric(df["year"])

		#print(df['year'])
		df['Season_Num'] = df.groupby(['PlayerName'])['year'].rank(method='dense')
		df['Contract_Season'] = df.groupby(['PlayerName', 'Team'])['year'].rank(method='dense')

		li.append(df)

	frame = pd.concat(li, axis=0, ignore_index=True)
	column_order = ['PlayerName', 'Season', 'Season_Num', 'Contract_Season', 'Age', 'Tm', 'Team', 'Lg', 'Pos', 'G', 'GS', 'MP', '3P',
       '3PA', '3P%', '2P', '2PA', '2P%', 'ORB', 'DRB', 'TRB', 'AST', 'STL',
       'BLK', 'PTS', 'TS%', 'BPM', 'VORP', 'Salary']
	#print(frame.columns)
	#frame = 

	frame[column_order].to_csv("/Users/jakehughes/Documents/data/player_stats_and_salary.csv")

def strip_whitespaces(string) -> str:
	string = string.strip()
	lines = string.split("\n")
	non_empty_lines = [line for line in lines if line.replace(" ", "") != ""]
	return_string = ""
	for line in non_empty_lines:
		return_string += line.strip() + "\n"

	return return_string

def take_line(string, line) -> str:
	middle_line = string.split("\n")[line]
	return middle_line

def get_position_and_hand(string) -> str:
	pos_shoot = string.split('▪')
	pos = pos_shoot[0]
	position = strip_whitespaces(pos)
	position = take_line(position, 1)

	shoot = pos_shoot[1]
	hand = strip_whitespaces(shoot)
	hand = take_line(hand, 1)

	return position, hand

def get_draft_parameters(string) -> str:
	draft = take_line(string, 1)
	draft_team = draft.split(',', 1)[0]
	draft_class = draft.split(',', 3)[-1].strip()
	draft_position_desc = draft.split('(', 1)[-1].split(')', 1)[0].split(',', 1)[-1].strip()
	draft_positon = []
	for i in draft_position_desc:
		if i.isdigit():
			draft_positon.append(i)
	return draft_team, draft_class, draft_positon[0]

def get_height_weight(string) -> str:
	phys = take_line(string, 0)	
	height = phys.split('cm', 1)[0][-3:]
	weight = phys.split('kg', 1)[0][-3:].strip()
	return height, weight

def get_college(string) -> str:
	college = take_line(string, 1)
	return college

def get_high_school(string) -> str:
	high_school = take_line(string, 1)
	return high_school

def get_player_profile(player, url) -> dict:
	pageTree = requests.get(url, headers=headers)
	pageSoup = BeautifulSoup(pageTree.content, 'html.parser')

	meta = pageSoup.find('div', {"id" : "meta"})

	ptags = meta.find_all('p')

	player_profile = {}

	position = None
	hand = None
	dteam = None
	dclass = None
	dpos = None
	nicknames = None
	no_nicknames = 0
	height = None
	weight = None
	college = None
	high_school = None

	for i in ptags:
		ptxt = i.text
		ptxt = strip_whitespaces(ptxt)
		if 'Position' in ptxt:
			position, hand = get_position_and_hand(ptxt)
		elif 'Draft' in ptxt:
			dteam, dclass, dpos = get_draft_parameters(ptxt)
		elif ptxt[0] == '(':
			nicknames = take_line(ptxt, 0)
			no_nicknames = nicknames.count(',') + 1
		elif 'lb' in ptxt:
			height, weight = get_height_weight(ptxt)
		elif 'College' in ptxt:
			college = get_college(ptxt)
		elif 'High School' in ptxt:
			high_school = get_high_school(ptxt)
		else:
			continue
			
	player_profile = {'height': height, 'weight': weight, 'position': position, 'hand': hand,
									   'draft_team': dteam, 'draft_class': dclass, 'draft_position': dpos,
									   'nicknames': nicknames, 'num_of_nicknames': no_nicknames,
									   'college': college, 'high_school': high_school}

	return player_profile

def generate_player_profiles():
	dic = get_player_list(1)

	player_meta = {}

	for i in dic:
		if os.path.exists("/Users/jakehughes/Documents/data/basketball_reference/"+dic[i]["PlayerName"].replace(" ", "_")+"_meta_data.csv"):
			print(dic[i]["PlayerName"]+' profile scraped')
		else:
			url = 'https://www.basketball-reference.com'+dic[i]['PlayerLink']
			#print(url)
			try:
				player_meta[dic[i]["PlayerName"]] = get_player_profile(dic[i]["PlayerName"], url)
			except:
				print("something wrong with the following page: \n")
				print(url)

	print(len(player_meta))


#main()
#price_and_points('LaMarcus Aldridge')
#collate_players_and_seasons()
generate_player_profiles()






