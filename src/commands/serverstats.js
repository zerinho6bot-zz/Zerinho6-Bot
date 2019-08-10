const { StorageUtils } = require("../Utils");
const { GuildStats, GuildWantingStats } = require("../local_storage");
const Time = new Date();
const TimeYear = Time.getFullYear();
const TimeMonth = Time.getMonth();

/**
 * Returns the month name.
 * @function
 * @param {object} t - The translate function. 
 * @param {number} month - The month related number.
 * @returns {string|boolean} 
 */
function Months(t, month) {
    const MonthsTranslated = Object.keys(t("serverstats:months"));
    return MonthsTranslated[month] ? t(`serverstats:months.${MonthsTranslated[month]}`) : false;
}

/**
 * Returns the month number.
 * @function
 * @param {object} t - The translate function.
 * @param {string} month - The month name.
 * @returns {number}
 */
function MonthsToNumber(t, month) {
    month = typeof month === "number" ? Months(t, month) : month;
    function MonthsTranslated() {
        let newArr = [];
        for (let i = 0; i < Object.values(t("serverstats:months")).length; i++) {
            newArr = newArr.concat(Object.values(t("serverstats:months"))[i].toLowerCase());
        }
        return newArr;
    }
    return MonthsTranslated().indexOf(month);
}

exports.run = async ({ bot, message, args, t, zSend, zEmbed, zSendAsync }) => {
    const ServerStats = new StorageUtils.ServerStats(GuildStats, bot);

    if (!ServerStats.guildWantsStats(message.guild.id)) {
        if (!message.channel.permissionsFor(message.author.id).has("MANAGE_GUILD")) {
            zSend("serverstats:thisGuildDontHaveServerStatsEnabled_NoPerm", true);
            return;
        }

        zSend("serverstats:thisGuildDontHaveServerStatsEnabled", true);
        await message.channel.awaitMessages((msg) => msg.author.id === message.author.id, { time: 30000, max: 1 })
            .then((c) => {
                const Msg = c.first();
                const MsgLower = Msg.content.toLowerCase();
                if (MsgLower === t("serverstats:no")) {
                    zSend("serverstats:staffDecidedNo", true);
                    return;
                } else if (MsgLower === t("serverstats:yes")) {
                    zSend("serverstats:staffDecidedYes_Part1", true);
                    GuildWantingStats.servers[Msg.guild.id] = {
                        lastMonthUpdated: 13 // Little trick, if I put 0 and the month is January...
                    };
                    StorageUtils.write("./local_storage/guild_wanting_stats.json");
                    zSend("serverstats:staffDecidedYes_Part2", true);
                    ServerStats.updateServersStats();

                    /*Since updateServersStats doesn't return nothing and it won't take that
                    long to update the JSON, I'll do this.*/
                    setTimeout(() => {
                        zSend("serverstats:staffDecidedYes_Part3", true);
                    }, 2000);
                    return;
                } else {
                    zSend("serverstats:staffDintGiveAOption", true);
                    return;
                }
            });
    }
    //Guild have stats...

    /**
     * Returns a good looking visualizer of availables years and months.
     * @function
     * @param {object} data
     * @returns {string}
     */
    function castadeVisualizer(data) {
        const Keys = Object.keys(data);

        let mainString = "";

        for (let i = 0; i < Keys.length; i++) {
            mainString += `● ${Keys[i]}\n`;

            let values = Object.keys(data[Object.keys(data)[i]]);
            for (let v = 0; v < values.length; v++) {
                mainString += `---${Months(t, values[v])}\n`;
            }
        }

        return mainString;
    }

    /**
     * Check if it's equal to ~, if it's..it'll return the current year, if not, it'll try to parse to Int.
     * @function
     * @param {string|number} year
     * @returns {number}
     */
    function translateYear(year) {
        if (year === "~") {
            return TimeYear;
        }

        return parseInt(year); //We don't really care about NaN, because it's a number.
    }

    /**
     * Check if it's equal to ~, if it's..it'll return the current month, if not, it'll try to parse to Int.
     * @function
     * @param {string|number} month
     * @returns {number}
     */
    function translateMonth(month) {
        if (month === "~") {
            return TimeMonth;
        }
        const MonthToNumber = MonthsToNumber(t, month);
        return MonthToNumber === -1 ? parseInt(month): MonthToNumber; //Again, we don't care about NaN, because it's a number.
    }

    /**
     * Checks if the Year or Month aren't really a Year or Month.
     * @function
     * @param {object} ServerStats - The ServerStats class. 
     * @param {string|number} year
     * @param {string|number} month 
     * @returns {boolean}
     */
    function validadeYearAndMonth(ServerStats, year, month) {
        const Year = translateYear(year);

        if (!ServerStats.getDataFromYear(message.guild.id, Year)) {
            zSend("serverstats:yearIsNotAvailable", true);
            return false;
        }

        if (!ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, Year), translateMonth(month))) {
            zSend("serverstats:monthIsNotAvailable", true);
            return false;
        }

        return true;
    }

    /**
     * Returns a string with a lot of informations.
     * @function
     * @param {object} ServerStats - The ServerStats class.
     * @param {string|number} oldYear 
     * @param {string} oldMonth 
     * @param {object} oldData 
     * @param {string|number} newYear 
     * @param {string} newMonth 
     * @param {object} newData 
     * @returns {string}
     */
    function returnSpecifiedDifference(ServerStats, oldYear, oldMonth, oldData, newYear, newMonth, newData) {
        return `${ServerStats.getDifference(oldData, newData)} (${oldData} ${t("serverstats:from")} ${oldYear}[${Months(t, oldMonth)}] - ${newData} ${t("serverstats:from")} ${newYear}[${Months(t, newMonth)}])${ServerStats.getStatus(oldData - newData)}`;
    }

    /**
     * Returns the lowest number.
     * @function
     * @param {number} firstData 
     * @param {number} secondData
     * @returns {number}
     */
    function returnOldestData(firstData, secondData) {
        return firstData > secondData ? secondData : firstData;
    }

    /**
     * Returns a string with a lot of informations comparing the firstDatas with the secondDatas.
     * @function
     * @param {object} comparationEmbed - The embed object being where informations willbe added.
     * @param {object} ServerStats - The ServerStats class.
     * @param {string|number} firstYear 
     * @param {number} firstMonth 
     * @param {object} firstData 
     * @param {string|number} secondYear 
     * @param {number} secondMonth 
     * @param {object} secondData 
     */
    function returnSpecifiedComparedData(comparationEmbed, ServerStats, firstYear, firstMonth, firstData, secondYear, secondMonth, secondData) {
        comparationEmbed.setTitle(`${t("serverstats:comparing")} ${firstYear}(${Months(t, firstMonth)}) ${t("serverstats:with")} ${secondYear}(${Months(t, secondMonth)})`);

        /**
         * Executes the returnSpecifiedDifference with most of arguments already defined so you don't need to repeat everything.
         * @function
         * @param {object} oldData 
         * @param {object} newData 
         * @returns {string}
         */
        function lessParamForSpecifiedDifference(oldData, newData) {
            return returnSpecifiedDifference(ServerStats, firstYear, firstMonth, oldData, secondYear, secondMonth, newData);
        }

        comparationEmbed.addField(t("serverstats:memberDifference"), lessParamForSpecifiedDifference(firstData.membersCount, secondData.membersCount), true);
        comparationEmbed.addField(t("serverstats:roleDifference"), lessParamForSpecifiedDifference(firstData.rolesCount, secondData.rolesCount), true);
        comparationEmbed.addField(t("serverstats:channelDifference"), lessParamForSpecifiedDifference(firstData.channelsCount, secondData.channelsCount), true);

        return comparationEmbed;
    }

    const FullDataFromServer = ServerStats.getDataFromServer(message.guild.id);

    if (args.length !== 3) {
        zEmbed.setTitle(t("serverstats:yourOptions"));
        zEmbed.setDescription(castadeVisualizer(FullDataFromServer));
        zSend(zEmbed);
        return;
    }

    const ArgsLower = args[0].toLowerCase();
    const CorrectArgs = typeof args[2] === "string" ? args[2].toLowerCase() : args[2];
    if (ArgsLower === t("serverstats:see")) {
        if (validadeYearAndMonth(ServerStats, args[1], CorrectArgs) === false) {
            return;
        }

        const Year = translateYear(args[1]);
        const Month = translateMonth(CorrectArgs);
        const DataFromMonth = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, Year), Month);

        zEmbed.setTitle(`${t("serverstats:summaryOf")} ${Year} ${Months(t, Month)}`);
        zEmbed.addField(t("serverstats:members"), DataFromMonth.membersCount, true);
        zEmbed.addField(t("serverstats:roles"), DataFromMonth.rolesCount, true);
        zEmbed.addField(t("serverstats:channels"), DataFromMonth.channelsCount, true);

        const Msg = await zSendAsync(zEmbed);
        if ((Year !== TimeYear || Month !== TimeMonth) && ServerStats.isComparationFromMonthAvailable(message.guild.id, TimeYear, TimeMonth)) {
            await Msg.react("🔁");
            const Collection = Msg.createReactionCollector((r, u) => r.emoji.name === "🔁" && !u.bot && u.id === message.author.id, { time: 30000 });

            Collection.on("collect", (r) => {
                let comparationEmbed = zEmbed;
                const CurrentMonthData = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, TimeYear), TimeMonth);

                comparationEmbed.fields = [];
                comparationEmbed = returnSpecifiedComparedData(comparationEmbed, ServerStats, Year, Month, DataFromMonth, TimeYear, TimeMonth, CurrentMonthData);

                Msg.edit(comparationEmbed);
            });
        }
    } else if (ArgsLower === t("serverstats:comparingLower")) {
        if (validadeYearAndMonth(ServerStats, args[1], CorrectArgs) === false) {
            return;
        }

        let firstYear = translateYear(args[1]);
        let firstMonth = translateMonth(CorrectArgs);

        zSend("serverstats:sendAnotherYearAndMonth", true);
        await message.channel.awaitMessages((msg) => msg.author.id === message.author.id, { time: 30000, max: 1 })
            .then((c) => {
                const Msg = c.first();
                const MsgArgs = Msg.content.split(" ");
                let secondYear = MsgArgs[0] || "";
                let secondMonth = MsgArgs[1] ? typeof MsgArgs[1] === "string" ? MsgArgs[1].toLowerCase() : MsgArgs[1] : "";

                if (validadeYearAndMonth(ServerStats, secondYear, secondMonth) === false) {
                    return;
                }

                secondYear = translateYear(secondYear);
                secondMonth = translateMonth(secondMonth);

                if (firstYear === secondYear && firstMonth === secondMonth) {
                    zSend("serverstats:sameDateDetected", true);
                    return;
                }
                //Time to do cursed things.
                //If the year isn't the same, find the oldest, else the difference is on the month.(Thanks god I don't store days)
                const DataToCompare = firstYear !== secondYear ? [firstYear, secondYear] : [firstMonth, secondMonth];
                const WhatWeAreComparing = DataToCompare[0].toString().length === 4 ? secondYear : secondMonth;
                //We want the oldest data to be the firstYear, that's why we are comparing to the secondYear

                if (returnOldestData(DataToCompare[0], DataToCompare[1]) === WhatWeAreComparing) {
                    //It's cursed, but better than wasting a lot of lines.
                    [firstYear, firstMonth, secondYear, secondMonth] = [secondYear, secondMonth, firstYear, firstMonth];
                }
                //Now we are sure that the firstYear is the oldest.

                const FirstDataFromMonth = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, firstYear), firstMonth);
                const SecondDataFromMonth = ServerStats.getDataFromMonth(ServerStats.getDataFromYear(message.guild.id, secondYear), secondMonth);

                zSend(returnSpecifiedComparedData(zEmbed, ServerStats, firstYear, firstMonth, FirstDataFromMonth, secondYear, secondMonth, SecondDataFromMonth));
            });
    } else {
        zSend("serverstats:anIdiotsGuide", true);
    }
};