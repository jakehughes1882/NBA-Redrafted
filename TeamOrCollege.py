import numpy as np
#import matplotlib.pyplot as plt
import pandas as pd 
#from collections import OrderedDict
import sys

#


def Team():
	NBA_Draft = pd.read_csv('NBADraftPicks_bar.csv', index_col=None)
	
	NBA_Draft['count'] = 1
	
	#NBA_ByTeam = NBA_Draft.groupby('Team')
	
	#print NBA_Draft.groupby('Team')
	grouped = NBA_Draft.drop(columns=["PlayerID", "YearDrafted", "Player", "College", "Seasons",  "Games", "Minutes", "Points", 
	                                  "Rebounds", "Assists", "Field Goal %", "Three Point %", "Free Throw %","Minutes Per Game", 
	                                  "Points Per Game", "Rebounds Per Game", "Assists Per Game", "Win Shares", "Win Shares Per 48 Minutes", 
	                                  "BPM", "VORP", "New_Draft_Order", "VORP_Deficit"],axis=1)
	
	grouped = grouped.groupby('Team').aggregate({'RankDeficit': 'sum', 'OverallRank': 'mean', 'count': 'sum', 'OverallReDraft': 'mean'})
	
	firstroundgrouped = NBA_Draft[NBA_Draft['OverallRank']<31]
	
	firstroundgrouped = firstroundgrouped.drop(columns=["PlayerID", "YearDrafted", "Player", "College", "Seasons",  "Games", "Minutes", 
													    "Points", "Rebounds", "Assists", "Field Goal %", "Three Point %", "Free Throw %",
													    "Minutes Per Game", "Points Per Game", "Rebounds Per Game", "Assists Per Game", "Win Shares", 
													    "Win Shares Per 48 Minutes", "BPM", "VORP", "New_Draft_Order", "VORP_Deficit"],axis=1)
	
	firstroundgrouped = firstroundgrouped.groupby('Team').aggregate({'RankDeficit': 'sum', 'OverallRank': 'mean', 'count': 'sum', 'OverallReDraft': 'mean'})
	
	firstroundgrouped = firstroundgrouped.round(1)
	
	print firstroundgrouped
	
	firstroundgrouped.to_csv("NBADraft_Team.csv", index = True, header=True, encoding = 'utf-8')
    
    
def College():
	NBA_Draft = pd.read_csv('NBADraftPicks_bar.csv', index_col=None)
	
	NBA_Draft['count'] = 1
	
	#NBA_ByTeam = NBA_Draft.groupby('Team')
	
	#print NBA_Draft.groupby('Team')
	grouped = NBA_Draft.drop(columns=["PlayerID", "YearDrafted", "Player", "Team", "Seasons",  "Games", "Minutes", 
	                                  "Points", "Rebounds", "Assists", "Field Goal %", "Three Point %", "Free Throw %",
	                                  "Minutes Per Game", "Points Per Game", "Rebounds Per Game", "Assists Per Game", "Win Shares", 
	                                  "Win Shares Per 48 Minutes", "BPM", "VORP", "New_Draft_Order", "VORP_Deficit"],axis=1)
	
	grouped = grouped.groupby('College').aggregate({'RankDeficit': 'sum', 'OverallRank': 'mean', 'count': 'sum', 'OverallReDraft': 'mean'})
	
	firstroundgrouped = NBA_Draft[NBA_Draft['OverallRank']<31]
	
	firstroundgrouped = firstroundgrouped.drop(columns=["PlayerID", "YearDrafted", "Player", "Team", "Seasons",  
														"Games", "Minutes", "Points", "Rebounds", "Assists", "Field Goal %", 
														"Three Point %", "Free Throw %","Minutes Per Game", "Points Per Game", 
														"Rebounds Per Game", "Assists Per Game", "Win Shares", "Win Shares Per 48 Minutes", 
														"BPM", "VORP", "New_Draft_Order", "VORP_Deficit"],axis=1)
	
	firstroundgrouped = firstroundgrouped.groupby('College').aggregate({'RankDeficit': 'sum', 'OverallRank': 'mean', 'count': 'sum', 'OverallReDraft': 'mean'})
	
	
	
	firstroundgrouped = firstroundgrouped.round(1)
	
	print firstroundgrouped
	
	firstroundgrouped.to_csv("NBADraft_College.csv", index = True, header=True, encoding = 'utf-8')
	
def Player():
	NBA_Draft = pd.read_csv('NBADraftPicks_bar.csv', index_col=None)
	
	NBA_Draft['count'] = 1
	
	#Lets perform team aggregates first	
	firstroundgrouped_team = NBA_Draft[NBA_Draft['OverallRank']<31]
	
	firstroundgrouped_team = firstroundgrouped_team.drop(columns=["PlayerID", "YearDrafted", "Player", "College", "Seasons",  "Games", "Minutes", 
													    "Points", "Rebounds", "Assists", "Field Goal %", "Three Point %", "Free Throw %",
													    "Minutes Per Game", "Points Per Game", "Rebounds Per Game", "Assists Per Game", "Win Shares", 
													    "Win Shares Per 48 Minutes", "BPM", "VORP", "New_Draft_Order", "VORP_Deficit"],axis=1)
	firstroundgrouped_team = firstroundgrouped_team.rename(columns={"RankDeficit": "TeamRankDeficit", "OverallRank": "TeamAverageRank", "count":"TeamPicks", "OverallReDraft":"TeamAverageRerank"})
	firstroundgrouped_team = firstroundgrouped_team.groupby('Team').aggregate({'TeamRankDeficit': 'sum', 'TeamAverageRank': 'mean', 'TeamPicks': 'sum', 'TeamAverageRerank': 'mean'})
	firstroundgrouped_team = firstroundgrouped_team.round(1)
	
	#print firstroundgrouped_team
	
	NBA_Draft = pd.merge(NBA_Draft, firstroundgrouped_team[['TeamRankDeficit', 'TeamAverageRank', 'TeamPicks', 'TeamAverageRerank']], left_on = 'Team', right_on = 'Team', how='left')
	
	#Lets perform college aggregates first	
	firstroundgrouped_college = NBA_Draft[NBA_Draft['OverallRank']<31]
	
	firstroundgrouped_college = firstroundgrouped_college.drop(columns=["PlayerID", "YearDrafted", "Player", "Team", "Seasons",  "Games", "Minutes", 
													    "Points", "Rebounds", "Assists", "Field Goal %", "Three Point %", "Free Throw %",
													    "Minutes Per Game", "Points Per Game", "Rebounds Per Game", "Assists Per Game", "Win Shares", 
													    "Win Shares Per 48 Minutes", "BPM", "VORP", "New_Draft_Order", "VORP_Deficit"],axis=1)
	firstroundgrouped_college = firstroundgrouped_college.rename(columns={"RankDeficit": "CollegeRankDeficit", "OverallRank": "CollegeAverageRank", "count":"CollegePicks", "OverallReDraft":"CollegeAverageRerank"})
	#print firstroundgrouped_college
	firstroundgrouped_college = firstroundgrouped_college.groupby('College').aggregate({'CollegeRankDeficit': 'sum', 'CollegeAverageRank': 'mean', 'CollegePicks': 'sum', 'CollegeAverageRerank': 'mean'})
	firstroundgrouped_college = firstroundgrouped_college.round(1)
	
	print NBA_Draft
	print '**********************t'
	print firstroundgrouped_college
	
	
	NBA_Draft = pd.merge(NBA_Draft, firstroundgrouped_college[['CollegeRankDeficit', 'CollegeAverageRank', 'CollegePicks', 'CollegeAverageRerank']], left_on = 'College', right_on = 'College', how='left')
	
	
	#NBA_Draft.to_csv("NBADraftPicks_scatter.csv", index = False, header=True, encoding = 'utf-8')
	
	

	
#Team()	
#College()
Player()
