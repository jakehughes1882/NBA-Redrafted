import numpy as np
#import matplotlib.pyplot as plt
import pandas as pd 
#from collections import OrderedDict
import sys



#NBA_Draft = NBA_Draft.drop(columns=['College', 'Seasons' , 'Games', 'Minutes', 'Points', 'Rebounds', 'Assists', 'Field Goal %','Three Point %',
#				                                                    'Free Throw %','Minutes Per Game', 'Points Per Game', 'Rebounds Per Game', 
#				                                                    'Assists Per Game', 'Win Shares', 'Win Shares Per 48 Minutes', 'BPM'],axis=1)


def redraft_grid():
	#Read in draft picks csv
	NBA_Draft = pd.read_csv('NBADraftPicks.csv', index_col=None)
	#Fill NA values with -5
	NBA_Draft['VORP'].fillna(-5, inplace=True)
	#Calculate redraft position
	NBA_ByYear = NBA_Draft.groupby('YearDrafted')
	NBA_ByYear['OverallRank'].rank(method='min', ascending = False)
	NBA_Draft['OverallReDraft'] = NBA_ByYear['VORP'].rank(method='min', ascending = False)
	#Calculating redraft deficit
	NBA_Draft['RankDeficit'] = NBA_Draft['OverallRank'] - NBA_Draft['OverallReDraft']
	NBA_Draft['OverallReDraft'] = NBA_Draft["OverallReDraft"].astype(int)
	#Sorting table for grid visualisation
	NBA_Draft.sort_values(["YearDrafted", "OverallRank"], inplace = True, ascending = [True, False]) 
	#Saving as new csv
	NBA_Draft.to_csv("NBADraftPicks_grid.csv", index = False, header=True, encoding = 'utf-8')
	
def redraft_bar():
	#Read in draft picks csv
	NBA_Draft = pd.read_csv('NBADraftPicks.csv', index_col=None)

	NBA_Draft = NBA_Draft[np.isfinite(NBA_Draft['VORP'])]
	
	#Calculate redraft position
	NBA_ByYear = NBA_Draft.groupby('YearDrafted')
	NBA_ByYear['OverallRank'].rank(method='min', ascending = False)
	NBA_Draft['OverallReDraft'] = NBA_ByYear['VORP'].rank(method='min', ascending = False)
	
	NBA_ByYear['OverallRank'].rank(method='min', ascending = False)
	NBA_Draft['New_Draft_Order'] = NBA_ByYear['OverallRank'].rank(method='min', ascending = True)
	#Calculating redraft deficit
	NBA_Draft['RankDeficit'] = NBA_Draft['OverallRank'] - NBA_Draft['OverallReDraft'] 
	NBA_Draft['OverallReDraft'] = NBA_Draft["OverallReDraft"].astype(int)
	NBA_Draft['New_Draft_Order'] = NBA_Draft["New_Draft_Order"].astype(int)
	NBA_Draft['VORP_Deficit'] = 0 
	

	NBA_dict = NBA_Draft.to_dict('index')
	
	for i in NBA_dict:
		for j in NBA_dict:
			if NBA_dict[i]['YearDrafted'] ==  NBA_dict[j]['YearDrafted']:
				if NBA_dict[i]['New_Draft_Order'] == NBA_dict[j]['OverallReDraft']:
					NBA_dict[i]['VORP_Deficit'] = round((NBA_dict[i]['VORP'] - NBA_dict[j]['VORP']), 1)
	
	New_NBA_Draft = pd.DataFrame.from_dict(data=NBA_dict, orient='index')			
	
	#Sorting table for vertical bar chart visualisation
	New_NBA_Draft.sort_values(['VORP_Deficit'], inplace = True, ascending = [False])
	#Saving as new csv
	New_NBA_Draft.to_csv("NBADraftPicks_bar.csv", index = False, header=True, encoding = 'utf-8')
	
	
	
redraft_bar()	
	

