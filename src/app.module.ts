import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({global:true, secret: '123'}),
    MongooseModule.forRoot('use-your-mongoURL', 
      {
      connectionFactory: (connection) => {
        console.log('MongoDB connected');
        return connection;
      },
    }), 
    BooksModule,
    UsersModule,
    TransactionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],    
})
export class AppModule {}


