module.exports = {
    /**
     * Returns the keys from the .env file.
     * @function
     * @returns {object}
     */
    envConfigs: function () {
        return process.env;
    },
    /**
     * Checks if FAST_LOAD on .env is false, if not, it'll show varius things on the terminal like RAM usage.
     * @function
     * @param {bot} - The Discord bot instance.
     */
    wowSuchGraphics(bot) {
        const { BootUtils } = require("./");

        if (BootUtils.envConfigs().FAST_LOAD !== "false") {
            console.log("Bot on! Ready to rock.");
            return;
        }

        const Terminal = require("terminal-kit").terminal;

        /**
         * Draw a icon and stats of the bot on the Terminal.
         * @function
         * @param {object} Bot - The Discord bot instance.
         * @param {object} Terminal - The terminal-kit package.
         */
        function drawOnce(Bot, Terminal) {
            const Users = Bot.users.size || 0;
            const Guilds = Bot.guilds.size || 0;
            /**
             * Returns a random number from 0 to 615.
             * @function
             * @returns {number}
             */
            const LuckyNumber = () => {
                return parseInt(Math.random() * 615);
            };
            const SaveNumber = LuckyNumber();
            const { Tips } = require("../local_storage");
            const RandomTip = Tips[parseInt(Math.random() * Object.keys(Tips).length)];

            /**
             * Returns a path to one of iconic icons made by Leticia, zerin_icon or topera_icon.
             * @function
             * @returns {string}
             */
            function getIcon() {
                const Assets = "./assets/";

                if (SaveNumber === 6) {
                    return Assets + "topera_icon.png";
                } else {
                    return Assets + "zerin_icon.png";
                }
            }

            Terminal.clear();
            Terminal.drawImage(getIcon(), { shrink: { width: Terminal.width / 1.8, height: (Terminal.height * 4) / 2.5 } }).then(() => {
                Terminal.yellow("\n\n[%s Guilds]      ", Guilds).red("[%s Users]      ", Users).blue("[%s RAM]      ", Math.round(process.memoryUsage().rss / 1024 / 1024))
                .green("[%s Lucky Number]\n\n", SaveNumber).grey("[Obs: %s]\n", RandomTip);
            });
        }

        drawOnce(bot, Terminal);
        setInterval(() => {
            drawOnce(bot, Terminal);
        }, BootUtils.envConfigs().TERMINAL_RELOAD_INTERVAL);
    }
};