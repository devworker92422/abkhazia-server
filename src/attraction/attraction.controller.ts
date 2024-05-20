import {
    Controller,
    HttpStatus,
    Post,
    Get,
    Body,
    Req,
    UseGuards,
    UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AttractionService } from "./attraction.service";
import { ImageService } from "src/image/image.service";
import { ImageEntity } from "src/image/image.entity";
import { AttractionBodyDTO, NewAttractionBodyDTO } from "./attraction.dto";

@Controller('/attraction')

export class AttractionController {
    constructor(
        private attractionService: AttractionService,
        private imageService: ImageService
    ) { }

    @Post('/insert')
    @UseGuards(AuthGuard('jwt'))
    async insertNewAttraction(
        @Body() body: NewAttractionBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1) {
            throw new UnauthorizedException('Нет разрешения на доступ')
        }
        const newAttraction = await this.attractionService.insert(body);
        for (const image of body.images) {
            const updatedImage = ImageEntity.create();
            updatedImage.id = image.id;
            updatedImage.attraction = newAttraction;
            await this.imageService.update(updatedImage);
        }
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Post('/')
    async getAttractions(@Body() body: AttractionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findAll(body),
            total: await this.attractionService.getTotalCount(body.directionID),
        }
    }

    @Get('/recent')
    async getRecently() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findRecently()
        }
    }

    @Post('/detail')
    async getAttraction(@Body() body: AttractionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findOne(body.attractionID)
        }
    }

    @Post('/update')
    @UseGuards(AuthGuard('jwt'))
    async updateAttraction(
        @Body() body: NewAttractionBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1) {
            throw new UnauthorizedException('Нет разрешения на доступ')
        }
        const updatedDirection = await this.attractionService.update(body);
        for (const image of body.images) {
            const updatedImage = ImageEntity.create();
            updatedImage.id = image.id;
            updatedImage.attraction = updatedDirection;
            await this.imageService.update(updatedImage);
        }
        return {
            statusCode: HttpStatus.OK
        };
    }

    @Post('/remove')
    @UseGuards(AuthGuard('jwt'))
    async removeAttraction(
        @Body() body: AttractionBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1) {
            throw new UnauthorizedException('Нет разрешения на доступ')
        }
        await this.attractionService.remove(body.attractionID);
        return {
            statusCode: HttpStatus.OK
        };
    }
}