/*global describe:true, it:true, before:true, after:true, beforeEach: true */
'use strict';

var
    demand      = require('must'),
    MockMessage = require('./mocks/message'),
    BART        = require('../plugins/bartly.js')
    ;

describe('BART', function()
{
    var fakeopts = { apikey: 'hamchunx', tzOffset: 420 };

    it('requires an options object', function(done)
    {
        function shouldThrow() { return new BART(); }
        shouldThrow.must.throw(/options object/);
        done();
    });

    it('requires an apikey option', function(done)
    {
        function shouldThrow() { return new BART({}); }
        shouldThrow.must.throw(/apikey/);
        done();
    });

    it('requires a tzOffset option', function(done)
    {
        function shouldThrow() { return new BART({ apikey: 'hamchunx' }); }
        shouldThrow.must.throw(/tzOffset/);
        done();
    });

    it('might not require a log?', function(done) { done(); });

    it('defaults to Oakland 12th St station', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.defaultStation.must.equal('12th');
        done();
    });

    it('can be constructed', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.must.be.truthy();
        plugin.must.have.property('help');
        plugin.help.must.be.a.function();
        plugin.must.have.property('matches');
        plugin.matches.must.be.a.function();
        plugin.must.have.property('respond');
        plugin.respond.must.be.a.function();
        done();
    });

    it('implements help() correctly', function(done)
    {
        var plugin = new BART(fakeopts);
        var help = plugin.help();
        help.must.be.a.string();
        help.length.must.be.above(0);
        done();
    });

    it('implements matches() correctly', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.matches('NOT VALID').must.be.false();
        plugin.matches('bart next').must.be.true();
        plugin.matches('bart 19th').must.be.true();
        plugin.matches('bart 12th embr').must.be.true();
        done();
    });

    it('implements respond() correctly', function(done)
    {
        var plugin = new BART(fakeopts);
        var msg = new MockMessage({text: 'bart milb'});
        msg.on('done', function() { done(); });
        plugin.respond(msg);
    });

    it('matches `bartly help`', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.matches('bartly help').must.be.true();
        done();
    });

    it('matches `bart help`', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.matches('bart help').must.be.true();
        done();
    });

    it('matches `bart foo bar`', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.matches('bart foo bar').must.be.true();
        done();
    });

    it('matches `bartly foo bar`', function(done)
    {
        var plugin = new BART(fakeopts);
        plugin.matches('bartly foo bar').must.be.true();
        done();
    });

    it('pattern breaks command & target correctly', function(done)
    {
        var plugin = new BART(fakeopts);
        var matches = 'bart 12th frmt'.match(plugin.pattern);
        matches.must.be.truthy();
        matches[2].must.equal('12th');
        matches[3].must.equal('frmt');
        done();
    });

    it('pattern breaks command & target correctly', function(done)
    {
        var plugin = new BART(fakeopts);
        var matches = 'bartly milb pitt'.match(plugin.pattern);
        matches.must.be.truthy();
        matches[2].must.equal('milb');
        matches[3].must.equal('pitt');
        done();
    });
});
