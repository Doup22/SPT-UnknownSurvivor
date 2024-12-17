"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const traderHelpers_1 = require("../src/traderHelpers");
const baseJson = require("../db/base.json");
const assortJson = require("../db/assort.json");
class UnknownSurvivor {
    mod;
    logger;
    traderHelper;
    constructor() {
        this.mod = "UnknownSurvivor";
    }
    /**
     
     * @param container Dependency container
     */
    preSptLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preSpt Loading... `);
        const preSptModLoader = container.resolve("PreSptModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        this.traderHelper = new traderHelpers_1.TraderHelper();
        this.traderHelper.registerProfileImage(baseJson, this.mod, preSptModLoader, imageRouter, "unknownsurvivor.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);
        Traders_1.Traders[baseJson._id] = baseJson._id;
        ragfairConfig.traders[baseJson._id] = false;
        this.logger.debug(`[${this.mod}] preSpt Loaded`);
    }
    /**
     
      @param container Dependency container
     */
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        const databaseServer = container.resolve("DatabaseServer");
        const jsonUtil = container.resolve("JsonUtil");
        const tables = databaseServer.getTables();
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil, assortJson);
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "UnknownSurvivor", baseJson.nickname, baseJson.location, "Get all your food and drink needs here!");
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}
exports.mod = new UnknownSurvivor();
//# sourceMappingURL=mod.js.map