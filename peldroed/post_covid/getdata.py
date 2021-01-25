import requests
from bs4 import BeautifulSoup
import pandas as pd
import sys
import os

headers = {'User-Agent': 
           'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'}


def ConvertGoals(dataframe):
	#split string based on ':' character
	new = dataframe["goals"].str.split(":", n = 1, expand = True) 
	#create new fields and convert to int data type
	dataframe['F'] = new[0].astype(int)
	dataframe['A'] = new[1].astype(int)
	dataframe.drop(columns =["goals"], inplace = True)
	#return datafame
	return dataframe

def GetTable(url):
	#Get page source for url passed into function
	pageTree = requests.get(url, headers=headers)
	pageSoup = BeautifulSoup(pageTree.content, 'html.parser')
	#grab the table html code
	table = pageSoup.find_all('table', {"class" : "standard_tabelle"})[1]
	#convert html code into dataframe
	df = pd.read_html(str(table))[0]
	#convert and split the For and Against goals string into seperate fields.
	dfnew = ConvertGoals(df)
	#return dataframe
	return dfnew

def JoinDataFrames(dfB, dfA, Season):
	#Rename columns for "pre Covid-19 table"
	dfB.columns = ['PreC_#', 'TeamLogo', 'Team Name', 'PreC_M', 'PreC_W', 'PreC_D', 'PreC_L', 'PreC_Dif', 'PreC_Pt', 'PreC_F', 'PreC_A']
	#merge columns
	df = dfB.merge(dfA , left_on='Team Name', right_on='Team.1')
	#calculate post Covid-19 table stats
	df['Final_#'] = df['#']
	df['PostC_M'] = df['M.'] - df['PreC_M']
	df['PostC_W'] = df['W'] - df['PreC_W']
	df['PostC_D'] = df['D'] - df['PreC_D']
	df['PostC_L'] = df['L'] - df['PreC_L']
	df['PostC_Dif'] = df['Dif.'] - df['PreC_Dif']
	df['PostC_Pt'] = df['Pt.'] - df['PreC_Pt']
	df['PostC_F'] = df['F'] - df['PreC_F']
	df['PostC_A'] = df['A'] - df['PreC_A']
	df['PostC_PPG'] = round((df['PostC_Pt'] / df['PostC_M']), 2)
	df['PreC_PPG'] = round((df['PreC_Pt'] / df['PreC_M']), 2)
	df['PPG_Diff'] = round((df['PostC_PPG'] - df['PreC_PPG']), 2)
	#drop unwanted columns
	df = df.drop(['TeamLogo', 'Team.1', '#', 'Team', 'M.', 'W',
	         'D', 'L', 'Dif.', 'Pt.', 'F', 'A'], axis=1)
	#add season to dataframe
	df['season'] = Season
	#return dataframe
	return df

def main(YearRange):
	Leagues = ['PremierLeague', 'Bundesliga', 'LaLiga', 'SerieA']
	LeaguePages = ['https://www.worldfootball.net/schedule/eng-premier-league-REPLACEYEAR-spieltag/REPLACEWEEK/', 
	  			   'https://www.worldfootball.net/schedule/bundesliga-REPLACEYEAR-spieltag/REPLACEWEEK/',
	  			   'https://www.worldfootball.net/schedule/esp-primera-division-REPLACEYEAR-spieltag/REPLACEWEEK/',
	  			   'https://www.worldfootball.net/schedule/ita-serie-a-REPLACEYEAR-spieltag/REPLACEWEEK/']
	PreWeek = ['29', '25', '27', '26']
	PostWeek = ['38', '34', '38', '38']
	Year = ['2019-2020', '2018-2019', '2017-2018', '2016-2017', '2015-2016']
	
	for i in range(len(LeaguePages)):
		if os.path.exists(Leagues[i]+".csv"):
			print(Leagues[i]+" already completed. Moving onto next league.")
		else:
			print("Scraping "+Leagues[i]+"...")
			for j in range(YearRange):
				print("Season: "+str(2020-(j+1))+'-'+str(2020-j))
				urlBEFORE = LeaguePages[i].replace('REPLACEYEAR', str(2020-(j+1))+'-'+str(2020-j)).replace('REPLACEWEEK', PreWeek[i])
				urlAFTER = LeaguePages[i].replace('REPLACEYEAR', str(2020-(j+1))+'-'+str(2020-j)).replace('REPLACEWEEK', PostWeek[i])
				if Leagues[i] == 'LaLiga' and str(2020-(j+1))+'-'+str(2020-j) == '2016-2017':
					urlBEFORE = 'https://www.worldfootball.net/schedule/esp-primera-division-2016-2017-spieltag_2/27/'
					urlAFTER = 'https://www.worldfootball.net/schedule/esp-primera-division-2016-2017-spieltag_2/38/'
				else:
					urlBEFORE = urlBEFORE
					urlAFTER = urlAFTER

				print(urlBEFORE)

				dfBEFORE = GetTable(urlBEFORE)
				dfAFTER = GetTable(urlAFTER)

				df = JoinDataFrames(dfBEFORE, dfAFTER, str(2020-(j+1))+'-'+str(2020-j))

				if os.path.exists(Leagues[i]+".csv"):
					df.to_csv(Leagues[i]+".csv", mode = 'a', index = False, header=False, encoding = 'utf-8')	
				else:
					df.to_csv(Leagues[i]+".csv", index = False, header=True, encoding = 'utf-8')

main(10)

