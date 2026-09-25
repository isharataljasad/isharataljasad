/* English count labels. The legacy module path is retained for compatibility. */
export function countNoun(n, { one, many }) { return `${n} ${n === 1 ? one : many}`; }
export const nouns = {
 task:{one:'task',many:'tasks'},sentence:{one:'sentence',many:'sentences'},
 achievement:{one:'achievement',many:'achievements'},minute:{one:'minute',many:'minutes'},
 word:{one:'word',many:'words'},week:{one:'week',many:'weeks'},
 assumption:{one:'assumption',many:'assumptions'},pattern:{one:'question type',many:'question types'},
};
