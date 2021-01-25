import requests
from bs4 import BeautifulSoup

headers = {'User-Agent': 
           'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'}


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


def get_player_profile():
	#url = 'https://www.basketball-reference.com/players/c/curryst01.html'
	url = 'https://www.basketball-reference.com/players/p/priceaj01.html'
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
			
	player_profile['Stephen Curry'] = {'height': height, 'weight': weight, 'position': position, 'hand': hand,
									   'draft_team': dteam, 'draft_class': dclass, 'draft_position': dpos,
									   'nicknames': nicknames, 'num_of_nicknames': no_nicknames,
									   'college': college, 'high_school': high_school}

	return player_profile



dictionary = get_player_profile()

print(dictionary)



