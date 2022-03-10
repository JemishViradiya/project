export enum CsvSampleFile {
  Application,
  DevCertificate,
  IpAddress,
  Domain,
}

class CsvFile {
  fileName: string
  content: string

  constructor(fileName: string, content: string) {
    this.fileName = fileName
    this.content = content
  }
}

const csvSampleFiles = new Map<CsvSampleFile, CsvFile>([
  [
    CsvSampleFile.Application,
    new CsvFile(
      'apps_import_example.csv',
      'App name,OS,Vendor,Version,Hash value,Description,\n' +
        'Example App Name,ANDROID,Example Vendor,1.0.0,3811A9F860D19B25FF579040E6E7292BAF25F58D0FC590AD362BAFBB5C47BBBB,,\n' +
        'Your App Name Here,IOS,Your Vendor Name,1500,AA2208539353E9416079D6CA48889E67F134E133A6AB9DFB1ADEB9700AD20728,,\n' +
        ',,,,,,\n' +
        ',,,,,,\n' +
        ',ANDROID or IOS,,,Must be SHA256 string,** Optional,Please remove this comment line\n',
    ),
  ],
  [
    CsvSampleFile.DevCertificate,
    new CsvFile(
      'developers_import_example.csv',
      'Developer name,OS,Issuer,Identifier,Subject,Description,\n' +
        'Example Vendor,ANDROID,Example Issuer,573A009454C547D3FD03831E5764AD4899F04B6BCC7291C153024B215DFE773A,Example Subject,,\n' +
        'Your Vendor Name,IOS,BlackBerry Limited. All rights reserved.,4972FBD78E2F528ED795E2EDE197C30FD1DB20155A659B81452572DB5232112C,,,\n' +
        ',,,,,,\n' +
        ',,,,,,\n' +
        ',ANDROID or IOS,,,** Optional,** Optional,Please remove this comment line\n',
    ),
  ],
  [
    CsvSampleFile.IpAddress,
    new CsvFile(
      'ip_addresses_import_example.csv',
      'Start,End,Description,\n' +
        '192.168.1.1,,,\n' +
        '192.168.1.2,192.168.2.255,,\n' +
        ',,,\n' +
        ',,,\n' +
        ',** Optional,** Optional,Please remove this comment line',
    ),
  ],
  [
    CsvSampleFile.Domain,
    new CsvFile(
      'domains_import_example.csv',
      'Domain,Description,\n' +
        'domain.com,,\n' +
        'www.example.com,,\n' +
        ',,\n' +
        ',,\n' +
        ',** Optional,Please remove this comment line\n',
    ),
  ],
])

export default csvSampleFiles
