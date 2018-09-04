var deviceProperties = [
    // dev_id,   map_id, no
    ["gs-co2-003", "001", 3],
    ["gs-co2-004", "001", 4],
    ["gs-co2-005", "001", 5],
    ["gs-co2-006", "001", 6],
    ["gs-co2-007", "001", 7],
    ["gs-co2-008", "001", 8],
    ["gs-co2-001", "002", 1],
    ["gs-co2-002", "002", 2],
    ["gs-co2-003", "002", 3],
    ["gs-co2-004", "002", 4],
    ["gs-co2-005", "002", 5],
    ["gs-co2-006", "002", 6],
    ["gs-co2-007", "002", 7],
    ["gs-co2-008", "002", 8],
];

var template = {
   dev_id:       (d) => d[0],
   map_id:       (d) => d[1],
   no:           (d) => d[2],
   week:         0,
   gas_density:  () => randomRangedInt(1200, 300),
   humidity:     () => randomRangedFloat(30, 22, /*fraction*/ 2),
   temperature:  () => randomRangedFloat(90, 30, /*fraction*/ 2),
}


function makeData(template, deviceProperties, targetDevice, dateGenerator)
{
    // targetDeviceがデバイス名ならそのデバイスのみ対象
    if (targetDevice != '*') {
      deviceProperties = [ takeTheDeviceProperty(targetDevice, deviceProperties) ];
    }

    var all_devices_records = deviceProperties.map( deviceProperty => {
                                 return generateRecords(template, deviceProperty, dateGenerator);
                             }).flatten();

    return "{\n" + all_devices_records.join(",\n") + "\n}";
}


//===========================
// main
//===========================
var [startDate, endDate, targetDevice,  min] = getTypedArgs(
     'Date',    'Date',  'string',      'integer'
);
var dateGenerator = new DateGenerator(startDate, endDate, new Minutes(min));

console.log(
  makeData(template, deviceProperties, targetDevice, dateGenerator)
)
