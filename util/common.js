
'use strict';
const config = require('../config/config');
const errors = require('../models/error');

const Common = function (constants) {

    const self = this;

    self.calculateAge = (dateString) => {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    self.calculateDateDifference = (start, end) => {
        let startDate = new Date(start);
        let endDate = new Date(end);
        let age = endDate.getFullYear() - startDate.getFullYear();
        let m = endDate.getMonth() - startDate.getMonth();
        if (m < 0 || (m === 0 && endDate.getDate() < startDate.getDate())) {
            age--;
        }
        return age;
    };
    self.shuffleArray = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };


    return self;
};

Common.$inject = ['constants'];

module.exports = Common;