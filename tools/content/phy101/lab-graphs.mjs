import { plot, render, dot, label, seg } from '../svg.mjs';

// Spring data: extension (m) vs force (N); best-fit line F = 200x (k = 200 N/m).
const data = [[0.01, 2.1], [0.02, 3.9], [0.03, 6.2], [0.04, 7.9], [0.05, 10.1], [0.06, 11.9]];
const fig = render('phy-lab', {
  title: 'Force against extension for a spring, with a best-fit line',
  desc: 'Six measured points of force (newtons) against extension (metres), from (0.01, 2.1) to (0.06, 11.9). They lie close to a straight line through the origin. Two points far apart on the line, (0.01, 2.0) and (0.06, 12.0), are used to find the slope, 200 N/m, which is the spring constant k.',
}, plot({ x: [0, 0.07], y: [0, 14], xticks: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06], yticks: [2, 4, 6, 8, 10, 12], xlabel: 'extension x (m)', ylabel: 'force F (N)', margin: { l: 50 } }, [
  seg(0, 0, 0.068, 13.6, { color: '#176e66', width: 2.5 }),
  ...data.map(([x, y]) => dot(x, y, { color: '#b3412e', r: 5 })),
  seg(0.01, 2, 0.06, 2, { color: '#9b6328', width: 1.8, dash: '5 4' }), seg(0.06, 2, 0.06, 12, { color: '#9b6328', width: 1.8, dash: '5 4' }),
  label(0.035, 2, 'run Δx = 0.05 m', { dy: -8, anchor: 'middle', size: 13, color: '#9b6328' }),
  label(0.06, 6, 'rise ΔF = 10 N', { dx: -8, anchor: 'end', size: 13, color: '#9b6328' }),
  label(0.013, 0.6, 'slope = 10/0.05 = 200 N/m = k', { size: 14, color: '#176e66' }),
]));

export default {
  summary: 'Plot measured data, draw the best straight line, and read physics from its slope and intercept — with units and a realistic uncertainty.',
  why: [
    'Laboratory work is part of PHY 101. Physical laws are tested and constants are measured by plotting data and fitting a line. A graph averages out random scatter, shows whether a model fits, and reveals mistakes that a single calculation hides. Engineers use the same skill to calibrate sensors and extract material properties.',
  ],
  idea: [
    'Put the quantity you control (the **independent variable**) on the horizontal axis and the one you measure in response (the **dependent variable**) on the vertical axis. Label both axes with the quantity and its unit, and choose scales that spread the points over most of the graph.',
    'If the relationship is linear, y = mx + b, the points should scatter around a straight line. Draw the **best-fit line**: roughly as many points above as below, following the trend — not simply joining the first and last points, and not forced through every point. Real data always scatter.',
    'The **slope** m = {{Δy|Δx}} has units (y-unit)/(x-unit) and usually means something physical: the slope of position against time is velocity, of velocity against time is acceleration, of force against extension is the spring constant. Calculate it from two points **on the line**, far apart, not from two data points.',
    'The **intercept** b is the value of y when x = 0. A theory may predict it (often zero); a non-zero intercept can indicate a systematic error, like a zero offset in the instrument.',
    'Many laws are not linear, but can be made linear. For a falling object, d = {{1|2}}gt^{2}: plot d against t^{2} (not t) to get a straight line with slope g/2. For a pendulum, T = 2π√{L/g}: plot T^{2} against L, slope 4π^{2}/g. This is called **linearising** the data.',
    'Every measurement has **uncertainty**. Random errors scatter the points and can be reduced by repeating and averaging; systematic errors shift all readings the same way and cannot be removed by averaging. Report results as value ± uncertainty with a unit, and compare with an accepted value by percentage error.',
  ],
  background: [
    { title: 'Straight-line equation', text: 'y = mx + b; slope m = {{y_{2} − y_{1}|x_{2} − x_{1}}}; intercept b where the line meets the y-axis.' },
    { title: 'Units and significant figures', text: 'See “Units and measurement”. A slope has the unit of y divided by the unit of x.' },
  ],
  definitions: [
    ['Independent / dependent variable', 'The quantity you choose or control (x-axis) / the quantity that responds (y-axis).'],
    ['Best-fit line', 'The straight line that best represents the trend of the data, balancing points above and below. (A calculator or spreadsheet computes the least-squares line.)'],
    ['Slope and intercept', 'Slope: rate of change of y with x, with units. Intercept: value of y when x = 0.'],
    ['Linearisation', 'Plotting transformed quantities (such as t² or T²) so that a non-linear law appears as a straight line.'],
    ['Random vs systematic error', 'Random: unpredictable scatter in both directions. Systematic: consistent bias in one direction (miscalibration, zero offset, reaction time).'],
    ['Percentage error', '{{∣measured − accepted∣|∣accepted∣}} × 100%, for a nonzero accepted value.'],
  ],
  symbols: [
    ['m', 'slope of the graph', 'y-unit ÷ x-unit'], ['b', 'intercept', 'y-unit'], ['k', 'spring constant (example slope)', 'N/m'], ['±δ', 'uncertainty of a value', 'same as the value'],
  ],
  formulas: [
    { name: 'Slope from the line', f: 'm = {{y_{2} − y_{1}|x_{2} − x_{1}}}', when: 'Use two widely separated points read from the best-fit line, not raw data points.' },
    { name: 'Meaning of common slopes', f: 'x–t: v;   v–t: a;   F–x: k (Hooke’s law);   d–t²: g/2;   T²–L: 4π²/g', when: 'Each requires the corresponding model to hold (constant velocity, constant acceleration, elastic limit, small pendulum swings).' },
    { name: 'Area under a graph', f: 'area under v–t = displacement;   area under F–x = work', when: 'Area in (y-unit × x-unit).' },
    { name: 'Mean and spread of repeated readings', f: 'x̄ = {{x_{1} + … + x_{n}|n}};   uncertainty ≈ {{x_{max} − x_{min}|2}}', when: 'A simple estimate for a few repeated readings; laboratory courses use the standard deviation.' },
  ],
  derivation: {
    title: 'Linearising free-fall data',
    intro: 'A ball is dropped from rest; the theory says d = {{1|2}}gt^{2}.',
    steps: [
      ['A graph of d against t is a curve (a parabola), so its slope is not constant.', 'Hard to read a constant from a curve.'],
      ['Compare d = ({{g|2}})(t^{2}) with y = mx: take y = d and x = t^{2}.', 'Match the form of a straight line through the origin.'],
      ['Plot d against t^{2}; the slope is g/2, so g = 2 × slope.', 'Units: m/s², as required.'],
    ],
    end: 'If the points on the d–t² graph lie on a straight line through the origin, the data support the model.',
  },
  figure: { svg: fig, caption: 'Spring data. The best-fit line (green) passes among the points, not through all of them. Its slope, read from two distant points on the line, is the spring constant.' },
  table: {
    caption: 'Measured spring data used in the graph',
    head: ['extension x (m)', 'force F (N)', 'F/x (N/m)'],
    rows: data.map(([x, y]) => [String(x), y.toFixed(1), (y / x).toFixed(0)]),
    note: 'The individual ratios scatter (190–210 N/m); the graph’s slope averages them. Reported: k = 200 ± 10 N/m.',
  },
  method: {
    title: 'From data to a result',
    steps: [
      'Decide which variable is independent (x) and dependent (y); if the law is non-linear, choose transformed variables that make it linear.',
      'Draw axes with quantities and units; choose scales so the data fill most of the grid.',
      'Plot the points carefully; add error bars if uncertainties are known.',
      'Draw the best-fit straight line (or use least squares).',
      'Find the slope from two distant points on the line; include units. Note the intercept.',
      'Interpret: what physical quantity is the slope? Compare with the expected value (percentage error) and discuss sources of error.',
    ],
  },
  examples: [
    {
      title: 'Velocity from a position–time graph',
      problem: 'A position–time graph is a straight line through (0 s, 1 m) and (2 s, 7 m). Find the velocity.',
      steps: [
        ['Slope = {{7 − 1|2 − 0}} = {{6 m|2 s}}.', 'Rise over run with units.'],
        ['= 3 m/s.', 'Slope of x–t is velocity.'],
      ],
      result: 'v = 3 m/s (constant, since the graph is straight).',
      meaning: 'The intercept 1 m is the starting position.',
    },
    {
      title: 'Spring constant from a graph',
      problem: 'Force against extension gives a best-fit line through (0.02 m, 4 N) and (0.06 m, 12 N). Find k.',
      steps: [
        ['Slope = {{12 − 4|0.06 − 0.02}} = {{8 N|0.04 m}} = 200 N/m.', 'Two points on the line.'],
        ['Hooke’s law F = kx, so the slope is k.', 'Interpret the slope physically.'],
      ],
      result: 'k = 200 N/m.',
      meaning: 'A stiffer spring would give a steeper line.',
    },
    {
      title: 'Acceleration and displacement from a velocity–time graph',
      problem: 'A v–t graph is a straight line from (0 s, 2 m/s) to (4 s, 10 m/s). Find the acceleration and the displacement in the 4 s.',
      steps: [
        ['a = slope = {{10 − 2|4}} = 2 m/s^{2}.', 'Slope of v–t.'],
        ['Displacement = area under the line = trapezium = {{2 + 10|2}} × 4 = 24 m.', 'Area under v–t.'],
      ],
      result: 'a = 2 m/s^{2}; displacement 24 m.',
      meaning: 'Check with Δx = v₀t + ½at² = 8 + 16 = 24 m.',
    },
    {
      title: 'g from linearised free-fall data',
      problem: 'A plot of drop distance d against t^{2} gives a straight line through the origin with slope 4.85 m/s^{2}. Find g and compare with 9.81 m/s^{2}.',
      steps: [
        ['d = {{1|2}}gt^{2}, so slope = g/2.', 'Linearised model.'],
        ['g = 2 × 4.85 = 9.70 m/s^{2}.', 'Solve for g.'],
        ['Percentage error = {{∣9.70 − 9.81∣|9.81}} × 100% = 1.1%.', 'Compare with the accepted value.'],
      ],
      result: 'g ≈ 9.70 m/s^{2}, 1.1% below the accepted value.',
      meaning: 'A consistently low result may indicate a systematic error such as air resistance or a timing delay.',
    },
    {
      title: 'Averaging repeated readings',
      problem: 'Five timings of 10 pendulum swings: 14.2, 14.5, 14.3, 14.6, 14.4 s. Find the period with an uncertainty.',
      steps: [
        ['Mean: {{14.2 + 14.5 + 14.3 + 14.6 + 14.4|5}} = 14.4 s for 10 swings.', 'Average reduces random error.'],
        ['Half-range: {{14.6 − 14.2|2}} = 0.2 s.', 'Simple uncertainty estimate.'],
        ['Period T = 1.44 ± 0.02 s.', 'Divide both by 10: timing many swings reduces the relative effect of reaction time.'],
      ],
      result: 'T = 1.44 ± 0.02 s.',
      meaning: 'Timing 10 swings rather than one makes the reaction-time error ten times smaller per period.',
    },
  ],
  mistakes: [
    ['Joining the dots, or forcing the line through the first and last point.', 'Draw one best-fit line through the trend of all the points.'],
    ['Calculating the slope from two data points.', 'Use two points on the fitted line, far apart.'],
    ['Slope without units.', 'The slope’s unit is y-unit ÷ x-unit, and it often is the physical result.'],
    ['Plotting a curved relationship and reading a “slope”.', 'Linearise first (e.g. d against t²).'],
    ['“Averaging removes all errors.”', 'Averaging reduces random errors only; systematic errors remain.'],
  ],
  scope: [
    'The specific experiments of your PHY 101 laboratory are not listed in the published description; use your laboratory manual for procedures and required uncertainty analysis.',
    'Least-squares formulas and standard deviations are introduced only by name here.',
  ],
  checks: [
    ['x-t slope', 6 / 2, 3, 0], ['k', 8 / 0.04, 200, 1e-9], ['a', 8 / 4, 2, 0], ['area', 6 * 4, 24, 0],
    ['g', 9.7, 2 * 4.85, 1e-12], ['pct', Math.abs(9.7 - 9.81) / 9.81 * 100, 1.1, 0.05], ['mean', (14.2 + 14.5 + 14.3 + 14.6 + 14.4) / 5, 14.4, 1e-9],
    ['fit near 200', data.reduce((s, [x, y]) => s + x * y, 0) / data.reduce((s, [x]) => s + x * x, 0), 200, 3],
  ],
};
