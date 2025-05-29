import { QuestionCategory, QuestionItem } from './types';

export const ALL_CATEGORIES: QuestionCategory[] = Object.values(QuestionCategory);

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 10;
export const MAX_CONSECUTIVE_MISSES_GUARANTEED_TURN = 10;

export const PREDEFINED_QUESTIONS: QuestionItem[] = [
  // Intense Truths
  { id: 't_int_1', type: 'truth', text: 'What is your deepest regret that you\'ve never told anyone?', categories: [QuestionCategory.INTENSE] },
  { id: 't_int_2', type: 'truth', text: 'What are you most insecure about physically or emotionally?', categories: [QuestionCategory.INTENSE] },
  { id: 't_int_3', type: 'truth', text: 'Have you ever questioned your sanity? What made you feel that way?', categories: [QuestionCategory.INTENSE] },

  // Romantic Truths
  { id: 't_rom_1', type: 'truth', text: 'Describe your ideal romantic partner in three words.', categories: [QuestionCategory.ROMANTIC] },
  { id: 't_rom_2', type: 'truth', text: 'What is the most romantic thing someone has ever done for you?', categories: [QuestionCategory.ROMANTIC] },
  { id: 't_rom_3', type: 'truth', text: 'Do you believe in love at first sight? Why or why not?', categories: [QuestionCategory.ROMANTIC] },
  
  // Career Truths
  { id: 't_car_1', type: 'truth', text: 'If money were no object, what career would you pursue?', categories: [QuestionCategory.CAREER] },
  { id: 't_car_2', type: 'truth', text: 'What is the biggest professional mistake you\'ve made?', categories: [QuestionCategory.CAREER] },

  // Deception Truths
  { id: 't_dec_1', type: 'truth', text: 'What is the biggest lie you have ever told and gotten away with?', categories: [QuestionCategory.DECEPTION] },
  { id: 't_dec_2', type: 'truth', text: 'Have you ever cheated on a test or in a game? What happened?', categories: [QuestionCategory.DECEPTION] },

  // Fun Truths
  { id: 't_fun_1', type: 'truth', text: 'What is your most embarrassing childhood memory?', categories: [QuestionCategory.FUN] },
  { id: 't_fun_2', type: 'truth', text: 'If you could have any superpower, what would it be and why?', categories: [QuestionCategory.FUN] },
  { id: 't_fun_3', type: 'truth', text: 'What\'s a weird food combination you secretly enjoy?', categories: [QuestionCategory.FUN] },

  // Wild Truths
  { id: 't_wild_1', type: 'truth', text: 'What is the craziest, most spontaneous thing you have ever done?', categories: [QuestionCategory.WILD] },
  { id: 't_wild_2', type: 'truth', text: 'Have you ever broken the law (even a minor one)? What was it?', categories: [QuestionCategory.WILD, QuestionCategory.DECEPTION] },

  // Intense Dares
  { id: 'd_int_1', type: 'dare', text: 'Share your screen time report for the last week with the group.', categories: [QuestionCategory.INTENSE] },
  { id: 'd_int_2', type: 'dare', text: 'Let the group go through your photo gallery for 1 minute (you can skip 3 photos).', categories: [QuestionCategory.INTENSE, QuestionCategory.WILD] },
  
  // Romantic Dares
  { id: 'd_rom_1', type: 'dare', text: 'Write a short, heartfelt poem for the person to your left and read it aloud.', categories: [QuestionCategory.ROMANTIC, QuestionCategory.FUN] },
  { id: 'd_rom_2', type: 'dare', text: 'Slow dance with an imaginary partner for 30 seconds.', categories: [QuestionCategory.ROMANTIC, QuestionCategory.FUN] },

  // Career Dares
  { id: 'd_car_1', type: 'dare', text: 'Give a 1-minute impromptu presentation on why you are the best candidate for a job you know nothing about.', categories: [QuestionCategory.CAREER, QuestionCategory.FUN] },

  // Fun Dares
  { id: 'd_fun_1', type: 'dare', text: 'Do your best impersonation of another player in the group until someone guesses who it is.', categories: [QuestionCategory.FUN] },
  { id: 'd_fun_2', type: 'dare', text: 'Speak only in rhymes for the next 5 minutes.', categories: [QuestionCategory.FUN] },
  { id: 'd_fun_3', type: 'dare', text: 'Try to juggle 3 unconventional items (e.g., socks, fruit) for 30 seconds.', categories: [QuestionCategory.FUN] },

  // Wild Dares
  { id: 'd_wild_1', type: 'dare', text: 'Post "I love pineapples on pizza" on your main social media feed (and delete after 10 minutes).', categories: [QuestionCategory.WILD, QuestionCategory.FUN] },
  { id: 'd_wild_2', type: 'dare', text: 'Wear socks on your hands for the rest of the game.', categories: [QuestionCategory.WILD, QuestionCategory.FUN] },
  { id: 'd_wild_3', type: 'dare', text: 'Let the group give you a temporary silly nickname you must respond to for the next 3 rounds.', categories: [QuestionCategory.WILD, QuestionCategory.FUN] },
];