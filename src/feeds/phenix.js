const { LotType } = require('../enum')
const env = require('../env')

const LotCode = {
  [LotType.PK10LA]: 'XYFT2',
  [LotType.PK10BJ]: 'BJSC',
  [LotType.LHHK]: 'LHC',
  [LotType.K3L3]: 'WFK3',
  [LotType.D3W]: 'FC3D'
}

function getInputConfig(type) {
  return {
    type: 'http',
    request: {
      url: env.phenixUrl,
      method: 'POST',
      type: 'form-urlencoded',
      body: { lotCode: LotCode[type] }
    },
    response: {
      type: 'json',
      model: {
        current: {
          no: '{{$resp.body.current.qiHao}}',
          date: "{{time($resp.body.current.activeTime,'+08:00')}}"
        },
        history: [
          'for(record of $resp.body.history)',
          {
            no: '{{record.qiHao}}',
            result: "{{record.haoMa.split(',').map(Number)}}",
            dateCreated: '{{new Date().toISOString()}}'
          }
        ]
      }
    }
  }
}

function getOutputConfig(type) {
  return {
    type: 'http',
    request: {
      url: env.gscriptUrl,
      method: 'POST',
      type: 'json',
      body: { type, results: '{{$result.history}}' }
    },
    response: {
      type: 'json',
      model: {
        url: '{{$req.url}}',
        status:
          '{{$resp.status !== 200 ? $resp.status : $resp.body.success ? 200 : 998}}'
      }
    }
  }
}

module.exports = function getFeed(type, cronTime) {
  if (!LotCode[type]) throw new Error(`Phenix does not support '${type}'`)
  return {
    lotType: type,
    cronTime,
    runCronOnInit: true,
    in: getInputConfig(type),
    out: getOutputConfig(type)
  }
}
