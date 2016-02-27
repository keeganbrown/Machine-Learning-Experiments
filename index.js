'use strict';
const synaptic = require('synaptic');
const fs = require('fs');
const Architect = synaptic.Architect;


const input = 9;
const pool = 10;
const output = 1;
const connections = 30;
const gates = 10;

const TRAINING_SET = ([0,1,2,3,4,5,6,7,8,9]).map((num, index, arr) => {
  let _narr = arr.slice();
  _narr.splice(index, 1);
  return {
    input: _narr,
    output: [ num/10 ]
  };
});

console.log(TRAINING_SET);

var LSM = new Architect.Liquid(input, pool, output, connections, gates);
let total = 0;
let right = 0;
let last = 200;

function trainNetwork () {
  LSM.trainer.train(TRAINING_SET, {
    iterations: 200000,
    schedule: {
      every: 5000,
      do: (data) => {
        //console.log(data);
        //if (data.iterations > 250000) {
        //  return true;
        //}
      }
    }
  });
  testNetwork();
}

function testNetwork () {
  let precision = 5;
  let perc = 0;
  [1,1,1,1,1]
    .map((num)=>{
      return TRAINING_SET[Math.floor(Math.random()*TRAINING_SET.length)]
    })
    .forEach((setItem)=>{
      let trained = LSM.activate(setItem.input);
      total += 1;
      //console.log( trained, 'expected:', setItem.output, 'similarity:'  );
      if (Math.floor(trained[0]*precision) == Math.floor(setItem.output[0]*precision)) {
        right += 1;
        perc = Math.floor((right/total)*100);
        total && right && console.log(perc, right, total);
      }
      LSM.propagate(0.1, setItem.output)
    });

  saveNetwork(perc);
}

function saveNetwork (perc) {
  if (Math.abs(perc-last) === 0 && perc > 60) {
    last = perc;
    fs.writeFile("./network.json", JSON.stringify(LSM.toJSON()), function(err) {
      if(err) {
        return console.log(err);
      }
      process.nextTick(trainNetwork);
      console.log("The file was saved!");
    });
  } else {
    process.nextTick(trainNetwork);
  }
}

trainNetwork();
