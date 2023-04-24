#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::Serialize;
use sqlite::{Connection, State};
use srtlib::Subtitles;
use rust_stemmers::{Algorithm, Stemmer};
use std::{collections::HashMap, path::PathBuf};

fn is_stop_word(word: &String) -> bool {
    let st_words = [
        "https",
        "http",
        "www",
        "ww",
        "em",
        "com",
        "ir",
        "org",
        "i",
        "me",
        "my",
        "myself",
        "we",
        "our",
        "ours",
        "ourselves",
        "you",
        "you're",
        "you've",
        "you'll",
        "you'd",
        "your",
        "yours",
        "yourself",
        "yourselves",
        "he",
        "him",
        "his",
        "himself",
        "she",
        "she's",
        "her",
        "hers",
        "herself",
        "it",
        "it's",
        "its",
        "itself",
        "they",
        "them",
        "their",
        "theirs",
        "themselves",
        "what",
        "which",
        "who",
        "whom",
        "this",
        "that",
        "that'll",
        "these",
        "those",
        "am",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "being",
        "have",
        "has",
        "had",
        "having",
        "do",
        "does",
        "did",
        "doing",
        "a",
        "an",
        "the",
        "and",
        "but",
        "if",
        "or",
        "because",
        "as",
        "until",
        "while",
        "of",
        "at",
        "by",
        "for",
        "with",
        "about",
        "against",
        "between",
        "into",
        "through",
        "during",
        "before",
        "after",
        "above",
        "below",
        "to",
        "from",
        "up",
        "down",
        "in",
        "out",
        "on",
        "off",
        "over",
        "under",
        "again",
        "further",
        "then",
        "once",
        "here",
        "there",
        "when",
        "where",
        "why",
        "how",
        "all",
        "any",
        "both",
        "each",
        "few",
        "more",
        "most",
        "other",
        "some",
        "such",
        "no",
        "nor",
        "not",
        "only",
        "own",
        "same",
        "so",
        "than",
        "too",
        "very",
        "s",
        "t",
        "can",
        "will",
        "just",
        "don",
        "don't",
        "should",
        "should've",
        "now",
        "d",
        "ll",
        "m",
        "o",
        "re",
        "ve",
        "y",
        "ain",
        "aren",
        "aren't",
        "couldn",
        "couldn't",
        "didn",
        "didn't",
        "doesn",
        "doesn't",
        "hadn",
        "hadn't",
        "hasn",
        "hasn't",
        "haven",
        "haven't",
        "isn",
        "isn't",
        "ma",
        "mightn",
        "mightn't",
        "mustn",
        "mustn't",
        "needn",
        "needn't",
        "shan",
        "shan't",
        "shouldn",
        "shouldn't",
        "wasn",
        "wasn't",
        "weren",
        "weren't",
        "won",
        "won't",
        "wouldn",
        "wouldn't",
    ];
    st_words.contains(&word.as_str())
}


struct Tokenizer {
    content: Vec<char>,
    cur: usize,
}
impl Tokenizer {
    pub fn new(content: String) -> Self {
        Self {
            content: content.chars().collect(),
            cur : 0
        }
    }

    fn is_empty(&self) -> bool {
        return self.content.len() <= self.cur ;
    }

    fn trim_left(&mut self) {
        while !self.is_empty() && self.content[self.cur].is_whitespace() {
            self.cur += 1;
        }
    }

    pub fn next_token(&mut self) -> Option<String> {
        self.trim_left();
        while !self.is_empty(){
            let first = self.content[self.cur];

            if first.is_alphabetic(){
                let index = self.cur;
                while !self.is_empty() && self.content[self.cur].is_alphanumeric() {
                    self.cur += 1;
                }
                let value = self.content[index..self.cur].to_owned();
                return Some(String::from_iter(value));
            } else {
                self.cur += 1;
            }
        }
        return None;
    }
}

#[derive(Serialize, Debug)]
struct HardWord {
    index: usize,
    word: String,
    time: String,
    sort_val: f64,
    defenition: String,
}

fn is_hard_word(ctx: &Context, word: &String) -> bool {
    let lower = word.to_lowercase();
    if word.len() < 3 { return false; }
    if word.chars().next().unwrap().is_uppercase() { return false; }
    if is_stop_word(&lower) {return false;}
    if ctx.is_word_freq(&word) {return false;}
    return true;
}

fn get_hard_words(ctx: &Context,index: usize,time: String, text: &String) -> Vec<HardWord> {
    let mut res = Vec::<HardWord>::new();
    let mut tkzer = Tokenizer::new(text.as_str().to_string());
    loop {
        match tkzer.next_token() {
            Some(word) => {
                if is_hard_word(ctx,&word) {
                    match ctx.fetch_rated_word(&word) {
                        Some((name,sort_val,def)) => {
                            let hard_word = HardWord {
                                index,
                                word,
                                time: time.as_str().to_string(),
                                sort_val,
                                defenition: def,
                            };
                            res.push(hard_word);
                              
                        },
                        None => {
                            let hard_word = HardWord {
                                index,
                                word,
                                time: time.as_str().to_string(),
                                sort_val: 100.0,
                                defenition: String::new(),
                            };
                            res.push(hard_word);
                        }

                    }
                }
            },
            None => {break;}
        }
    }
    return res;
}

struct Context {
    db: Connection,
    stemmer: Stemmer,
    freq_words: Vec<String>,
}
impl Context {
    pub fn new(path: &PathBuf) -> Self {
        
        let mut db = sqlite::open(path).unwrap();
        let en_stemmer = Stemmer::create(Algorithm::English);
        let freq_words = Vec::<String>::new();
        Self {
            db,
            stemmer: en_stemmer,
            freq_words
        }
    }

    pub fn fetch_freq_words(&mut self) {
        let query = "SELECT * FROM wordset_frequentword;";
        let mut statement = self.db.prepare(query).unwrap();
        while let Ok(State::Row) = statement.next() {
            self.freq_words.push(statement.read::<String, _>("name").unwrap());
        }
    }

    pub fn is_word_freq(&self, word: &String) -> bool {
        let word_stem = self.stemmer.stem(word.as_str());
        return self.freq_words.contains(word) || self.freq_words.contains(&word_stem.to_string());
    }

    pub fn fetch_rated_word(&self, word: &String) -> Option<(String,f64,String)> {
        let word_stem = self.stemmer.stem(word.as_str());

        let query = "SELECT * FROM wordset_ratedword WHERE name = :name;";
        let mut statement = self.db.prepare(query).unwrap();
        statement.bind((":name",word.as_str())).unwrap();
        if let Ok(State::Row) = statement.next() {
            let word = statement.read::<String, _>("name").unwrap();
            let rank = statement.read::<f64, _>("weight").unwrap();
            let def =  match statement.read::<Option<String>, _>("defenition").unwrap() {
                Some(d) => {d},
                None => {String::new()}
            };
            
            return Some((word,rank,def));
        }
        return None;
    }
}

#[derive(Serialize, Debug)]
struct Response {
    uncommon: Vec<HardWord>
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_difficult_words])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn get_difficult_words(handel: tauri::AppHandle, data: &str) -> String {
    let subs = Subtitles::parse_from_str(data.to_string()).unwrap().to_vec();
    let mut sub_items = Vec::<HardWord>::new();
    
    let resource_path = handel.path_resolver()
        .resolve_resource("db.sqlite3")
        .expect("failed to resolve resource");

    let mut ctx = Context::new(&resource_path);
    ctx.fetch_freq_words();
    for s in subs {
        let tv = s.start_time.get();
        let time_str = format!("{}:{}:{}",tv.0,tv.1,tv.2);
        let mut hard_words = get_hard_words(&ctx,s.num,time_str,&s.text);
        sub_items.append(&mut hard_words);
    }
    let mut seen: HashMap<String, bool> = HashMap::new();
    sub_items.retain(|x| seen.insert(x.word.as_str().to_string(), true).is_none());
    let res = Response { uncommon: sub_items };
    let response = serde_json::to_string(&res).unwrap();
    response
}
