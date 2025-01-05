"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    find(query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(query).sort({ createdAt: -1 }).exec();
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(query).populate("user").exec();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDocument = new this.model(data);
            return createdDocument.save();
        });
    }
    update(query, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndUpdate(query, updateData, { new: true }).exec();
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndDelete(query).exec();
        });
    }
}
exports.BaseRepository = BaseRepository;
