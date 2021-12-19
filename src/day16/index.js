const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput[0];

const input = prepareInput(readInput('input.txt'));

const testInput0 = 'D2FE28';
const testInput1 = '38006F45291200';
const testInput2 = 'EE00D40C823060';
const testInput3 = '8A004A801A8002F478';
const testInput4 = '620080001611562C8802118E34';
const testInput5 = 'C0015000016115A2E0802F182340';
const testInput6 = 'A0016C880162017C3686B18A3D4780';
const testInput7 ='C200B40A82';
const testInput8 ='04005AC33890';
const testInput9 ='880086C3E88112';
const testInput10 ='CE00C43D881120';
const testInput11 ='D8005AC2A8F0';
const testInput12 ='F600BC2D8F';
const testInput13 ='9C005AC2F8F0';
const testInput14 ='9C0141080250320F1802104A08';

const hexToBin = {
  '0' : '0000',
  '1' : '0001',
  '2' : '0010',
  '3' : '0011',
  '4' : '0100',
  '5' : '0101',
  '6' : '0110',
  '7' : '0111',
  '8' : '1000',
  '9' : '1001',
  'A' : '1010',
  'B' : '1011',
  'C' : '1100',
  'D' : '1101',
  'E' : '1110',
  'F' : '1111',
}

// returns remaining message and literal
const readLiteral = (message) => {
  // console.log(message);
  // if a literal, read in blocks of 5
  var blockstart = 0;
  var literalbits = '';
  var lastblock = false;
  while (!lastblock) {
    if (message[blockstart] === '0') {
      lastblock = true;
    }
    literalbits += message.slice(blockstart + 1, blockstart + 5);
    blockstart += 5;
  }
  var literal = parseInt(literalbits, 2);
  return [message.slice(blockstart), literal];
};

// returns message and packets
const readSubPackets = (lenTypeId, message) => {
  var packets = [];
  if (lenTypeId === 0) {
    // first 15 bits represent the length of subpackets
    var splen = parseInt(message.slice(0, 15), 2);
    // console.log('type 0 bitlength', splen);
    nextmsg = message.slice(15, 15 + splen);
    while (nextmsg !== '' && parseInt(nextmsg) !== 0) {
      var res = readPacket(nextmsg);
      nextmsg = res[0];
      packets.push(res[1]);
    }
    return [message.slice(15 + splen), packets];
  } else if (lenTypeId === 1) {
    // first 11 bits is the number of subpackets
    var numPackets = parseInt(message.slice(0, 11), 2);
    // console.log('type 1', numPackets);
    nextmsg = message.slice(11);
    for (let i = 0; i < numPackets; i++) {
      var res = readPacket(nextmsg);
      nextmsg = res[0];
      packets.push(res[1]);
    }
    return [nextmsg, packets];
  }
  return ['', packets];
};

class Packet {
  constructor() {
    this.version = 0;
    this.optype = 0;
    this.literal = 0;
    this.subpackets = [];
  }
}

// returns remaining message and packets
const readPacket = (message) => {
  if (parseInt(message) === 0) {
    return [];
  }
  var packets = [];
  var packet = new Packet();
  packet.version = parseInt(message.slice(0, 3), 2);
  packet.optype = parseInt(message.slice(3, 6), 2);
  var messageRem;
  if (packet.optype === 4) {
    var res = readLiteral(message.slice(6));
    // console.log('literalresult', res);
    messageRem = res[0];
    packet.literal = res[1];
  }
  packets.push(packet);
  if (packet.optype !== 4) {
    // all other types are operators
    var res = readSubPackets(parseInt(message[6]), message.slice(7));
    messageRem = res[0];
    packet.subpackets.push(...res[1]);
  }
  return [messageRem, packet];
};

const sumVersions = (packet) => {
  if (packet.subpackets.length === 0) {
    return packet.version;
  }
  var subpacketSum = packet.subpackets.reduce((prev, curr) => {
    return prev + sumVersions(curr); 
  }, 0);
  return packet.version + subpacketSum;
};

const goA = (input) => {
  var message = input.split('').map((el) => hexToBin[el]).join('');
  var res = readPacket(message);
  return sumVersions(res[1]);
};

const evaluate = (packet) => {
  if (packet.subpackets.length === 0) {
    return packet.literal;
  }
  if (packet.optype === 0) { // sum
    return packet.subpackets.reduce((prev, curr) => {
      return prev + evaluate(curr); 
    }, 0);
  } else if (packet.optype === 1) { // product 
    return packet.subpackets.reduce((prev, curr) => {
      return prev * evaluate(curr); 
    }, 1);
  } else if (packet.optype === 2) { // minimum
    return Math.min(...(packet.subpackets.map((p) => evaluate(p))));
  } else if (packet.optype === 3) { // maximum
    return Math.max(...(packet.subpackets.map((p) => evaluate(p))));
  } else if (packet.optype === 5) { // greater than
    return evaluate(packet.subpackets[0]) > evaluate(packet.subpackets[1]) ? 1 : 0;
  } else if (packet.optype === 6) { // less than
    return evaluate(packet.subpackets[0]) < evaluate(packet.subpackets[1]) ? 1 : 0;
  } else if (packet.optype === 7) { // equal to
    return evaluate(packet.subpackets[0]) === evaluate(packet.subpackets[1]) ? 1 : 0;
  }
  return 0;
};

const goB = (input) => {
  var message = input.split('').map((el) => hexToBin[el]).join('');
  var res = readPacket(message);
  return evaluate(res[1]);
};

/* Tests */

test(goA(testInput0), 6);
test(goA(testInput1), 9);
test(goA(testInput2), 14);
test(goA(testInput3), 16);
test(goA(testInput4), 12);
test(goA(testInput5), 23);
test(goA(testInput6), 31);
test(goB(testInput7), 3);
test(goB(testInput8), 54);
test(goB(testInput9), 7);
test(goB(testInput10), 9);
test(goB(testInput11), 1);
test(goB(testInput12), 0);
test(goB(testInput13), 0);
test(goB(testInput14), 1);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
