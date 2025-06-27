import { Controller, Get, Param } from "@nestjs/common";
import { QueryService } from "./query.service";

@Controller("query")
export class QueryController{
    constructor(
        private queryService:QueryService
    ){}
    @Get("register-history/:limit")
    getRegisterHistory(@Param("limit") limit:string){
        return this.queryService.getRegistereds(Number(limit))
    }
    @Get("update-history/:limit")
    getUpdateHistory(@Param("limit") limit:string){
        // return {msg:`ok ${limit}`}
        return this.queryService.getUpdateds(Number(limit))
    }
    @Get("delete-history/:limit")
    getDeleteHistory(@Param("limit") limit:string){
        return this.queryService.getRemoveds(Number(limit))
    }
}