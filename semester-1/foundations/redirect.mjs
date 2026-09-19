const area={algebra:'algebra',trigonometry:'trigonometry',graphs:'algebra',units:'basic-math',logs:'algebra'}[location.hash.slice(1)];
location.replace(area?`/foundations/${area}/`:'/foundations/');
