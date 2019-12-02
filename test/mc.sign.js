var testMethod = require('./helpers/test.method.js');
var Mc = require('../packages/chain3-mc');


var mc = new Mc();

var method = 'sign';


var tests = [{
    args: ['Hello World!$*', '0xeb014f8c8b418db6b45774c326a0e64c78914dc0'],
    formattedArgs: ['0xeb014f8c8b418db6b45774c326a0e64c78914dc0', '0x48656c6c6f20576f726c6421242a'],
    result:'0xa6fbdf9da409497390e2cc14d3baa898b1a5cc86f9bbe39499119cc62aa6eb287bfa432d9efe01162bd73cc9b109426ca21ae071c3868cb6c449fa0cc71777ae1b',
    formattedResult: '0xa6fbdf9da409497390e2cc14d3baa898b1a5cc86f9bbe39499119cc62aa6eb287bfa432d9efe01162bd73cc9b109426ca21ae071c3868cb6c449fa0cc71777ae1b',
    call: 'mc_'+ method 
},{
    useLocalWallet: function (chain3) {
        chain3.mc.accounts.wallet.add('0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728');
    },
    args: ['Hello World!$*', '0xeb014f8c8b418db6b45774c326a0e64c78914dc0'],
    formattedArgs: ['0xeb014f8c8b418db6b45774c326a0e64c78914dc0', '0x48656c6c6f20576f726c6421242a'],
    result:'0xa6fbdf9da409497390e2cc14d3baa898b1a5cc86f9bbe39499119cc62aa6eb287bfa432d9efe01162bd73cc9b109426ca21ae071c3868cb6c449fa0cc71777ae1b',
    formattedResult: '0xa6fbdf9da409497390e2cc14d3baa898b1a5cc86f9bbe39499119cc62aa6eb287bfa432d9efe01162bd73cc9b109426ca21ae071c3868cb6c449fa0cc71777ae1b',
    call: null
},{
    args: ['Hello Wolrd!$*', '0xeb014f8c8b418db6b45774c326a0e64c78914dc0'],
    formattedArgs: ['0xeb014f8c8b418db6b45774c326a0e64c78914dc0', '0x48656c6c6f20576f6c726421242a'],
    result: '0xcba2e6f62848fb4981fa803995501485c493bc3b13ef4cfad69c1edcce454dce7998a17ceeb84e307c73546fddb495b49f45e5736e7af4a3c12287025067c7c01b',
    formattedResult: '0xcba2e6f62848fb4981fa803995501485c493bc3b13ef4cfad69c1edcce454dce7998a17ceeb84e307c73546fddb495b49f45e5736e7af4a3c12287025067c7c01b',
    call: 'mc_'+ method
},{
    useLocalWallet: function (chain3) {
        chain3.mc.accounts.wallet.add('0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728');
    },
    args: ['Hello Wolrd!$*', '0xeb014f8c8b418db6b45774c326a0e64c78914dc0'],
    formattedArgs: ['0xeb014f8c8b418db6b45774c326a0e64c78914dc0', '0x48656c6c6f20576f6c726421242a'],
    result: '0xcba2e6f62848fb4981fa803995501485c493bc3b13ef4cfad69c1edcce454dce7998a17ceeb84e307c73546fddb495b49f45e5736e7af4a3c12287025067c7c01b',
    formattedResult: '0xcba2e6f62848fb4981fa803995501485c493bc3b13ef4cfad69c1edcce454dce7998a17ceeb84e307c73546fddb495b49f45e5736e7af4a3c12287025067c7c01b',
    call: null
}];

testMethod.runTests('mc', method, tests);

