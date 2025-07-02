import { Controller, Get, Param,Headers } from "@nestjs/common";
import { QueryService } from "./query.service";

@Controller("query")
export class QueryController{
    constructor(
        private queryService:QueryService
    ){}
    @Get("register-history/:limit")
    getRegisterHistory(@Headers('authorization') authHeader: string,@Param("limit") limit:string){
        return this.queryService.getRegistereds(authHeader,Number(limit))
    }
    @Get("update-history/:limit")
    getUpdateHistory(@Headers('authorization') authHeader: string,@Param("limit") limit:string){
        // return {msg:`ok ${limit}`}
        return this.queryService.getUpdateds(authHeader,Number(limit))
    }
    @Get("delete-history/:limit")
    getDeleteHistory(@Headers('authorization') authHeader: string,@Param("limit") limit:string){
        return this.queryService.getRemoveds(authHeader,Number(limit))
    }
}