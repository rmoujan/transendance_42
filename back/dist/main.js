"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.use(cookieParser());
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:5173',
    }));
    await app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
}
bootstrap();
//# sourceMappingURL=main.js.map