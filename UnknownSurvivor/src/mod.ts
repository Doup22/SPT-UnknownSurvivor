import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { Traders } from "@spt/models/enums/Traders";
import { TraderHelper } from "../src/traderHelpers";
import baseJson = require("../db/base.json");
import assortJson = require("../db/assort.json");

class UnknownSurvivor   implements IPreSptLoadMod, IPostDBLoadMod
{
    private mod: string;
    private traderImgPath: string;
    private logger: ILogger;
    private traderHelper: TraderHelper;

    constructor() {
        this.mod = "UnknownSurvivor";
        this.traderImgPath = "res/unknownsurvivor.jpg"; 
    }

    /**
     
     * @param container Dependency container
     */
    public preSptLoad(container: DependencyContainer): void
    {
        
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preSpt Loading... `);

        
        const preSptModLoader: PreSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);


        this.traderHelper = new TraderHelper();
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${preSptModLoader.getModPath(this.mod)}${this.traderImgPath}`);
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);
        
        Traders[baseJson._id] = baseJson._id;

        
        ragfairConfig.traders[baseJson._id] = false;

        this.logger.debug(`[${this.mod}] preSpt Loaded`);
    }

    /**
     
      @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        
        const tables = databaseServer.getTables();

        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil, assortJson);
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "UnknownSurvivor", baseJson.nickname, baseJson.location, "There isn't much known about this trader. He appears to sell survival items like food and water. He may reveal that he offers much more as we gain his trust.");
        
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

export const mod = new UnknownSurvivor();