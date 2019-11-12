import requests
from bs4 import BeautifulSoup
import pandas as pd
import sys

#Define years of draft we want to draw from
x = range(2008, 2019)

#create header for scraping
headers = {'User-Agent': 
           'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'}

for Year in x:
	#Construct URL for last 10 years of NBA drafts and define page variables.
	page = "https://www.basketball-reference.com/draft/NBA_"+str(Year)+".html"
	pageTree = requests.get(page, headers=headers)
	pageSoup = BeautifulSoup(pageTree.content, 'html.parser')
	
	print pageSoup
	
	sys.exit()
	
	#table = pageSoup.find_all("table", {"id": "stats"})
	
	#Get table fields.
	OverallRank = pageSoup.find_all("td", {"data-stat": "pick_overall"})
	Team = pageSoup.find_all("td", {"data-stat": "team_id"})
	Player = pageSoup.find_all("td", {"data-stat": "player"})
	College = pageSoup.find_all("td", {"data-stat": "college_name"})
	Years = pageSoup.find_all("td", {"data-stat": "seasons"})
	Games = pageSoup.find_all("td", {"data-stat": "g"})
	MinutesPlayed = pageSoup.find_all("td", {"data-stat": "mp"})
	Points = pageSoup.find_all("td", {"data-stat": "pts"})
	Rebounds = pageSoup.find_all("td", {"data-stat": "trb"})
	Assists = pageSoup.find_all("td", {"data-stat": "ast"})
	FGPercent = pageSoup.find_all("td", {"data-stat": "fg_pct"})
	ThreePointPercent = pageSoup.find_all("td", {"data-stat": "fg3_pct"})
	FreeThrowPercent = pageSoup.find_all("td", {"data-stat": "ft_pct"})
	MinutesPerGame = pageSoup.find_all("td", {"data-stat": "mp_per_g"})
	PointsPerGame = pageSoup.find_all("td", {"data-stat": "pts_per_g"})
	ReboundsPerGame = pageSoup.find_all("td", {"data-stat": "trb_per_g"})
	AssistsPerGame = pageSoup.find_all("td", {"data-stat": "ast_per_g"})
	WinShares = pageSoup.find_all("td", {"data-stat": "ws"})
	WinSharesPer48Mins = pageSoup.find_all("td", {"data-stat": "ws_per_48"})
	BPM = pageSoup.find_all("td", {"data-stat": "bpm"})
	VORP = pageSoup.find_all("td", {"data-stat": "vorp"})
	
	#Define player dictionary
	print len(Player)
	print Year
	PlayerDictionary = {}
	#Loop through all 60 picks to append arrays above into PlayerDictionary
	for pick in range(60):
		#print Player[pick].text
		key = str(Year)+str(pick)
		PlayerDictionary[key] = {"OverallRank": OverallRank[pick].text,
											"PlayerID": key,
		                                    "YearDrafted": Year,
											"Team": Team[pick].text,
	                                        "Player": Player[pick].text,
	                                        "College": College[pick].text,
	                                        "Seasons": Years[pick].text,
	                                        "Games": Games[pick].text,
	                                        "Minutes": MinutesPlayed[pick].text, 
	                                        "Points": Points[pick].text, 
	                                        "Rebounds": Rebounds[pick].text,
	                                        "Assists": Assists[pick].text, 
	                                        "Field Goal %": FGPercent[pick].text,
	                                        "Three Point %": ThreePointPercent[pick].text, 
	                                        "Free Throw %": FreeThrowPercent[pick].text,
	                                        "Minutes Per Game": MinutesPerGame[pick].text,
	                                        "Points Per Game": PointsPerGame[pick].text, 
	                                        "Rebounds Per Game": ReboundsPerGame[pick].text,
	                                        "Assists Per Game": AssistsPerGame[pick].text, 
	                                        "Win Shares": WinShares[pick].text,
	                                        "Win Shares Per 48 Minutes": WinSharesPer48Mins[pick].text,
	                                        "BPM": BPM[pick].text,
	                                        "VORP": VORP[pick].text}
	#Add Dictionaries to csv
	if Year == 2008:
		pd.DataFrame.from_dict(data=PlayerDictionary, orient='index').to_csv("NBADraftPicks.csv", index = False, header=True, encoding = 'utf-8') 
	else:
		pd.DataFrame.from_dict(data=PlayerDictionary, orient='index').to_csv("NBADraftPicks.csv", mode = 'a', index = False,header=False, encoding = 'utf-8')                                     

