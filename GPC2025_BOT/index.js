require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const connectDB = require('./database/connect');

//MongoDB(사용하지 않음)
connectDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,  
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`명령어 로드 완료: ${command.name}`);
}

client.once('ready', () => {
    console.log(`봇 로그인: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    console.log(`받은 메시지: ${message.content}`); 

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    console.log(`감지된 명령어: ${commandName}`);

    const command = client.commands.get(commandName);
    if (!command) {
        console.log(`"${commandName}" 명령어를 찾을 수 없습니다.`); 
        return;
    }

    try {
        await command.execute(message, args);
        console.log(`"${commandName}" 명령어 실행 완료`); 
    } catch (error) {
        console.error('명령어 실행 중 오류:', error);
        message.reply('명령어 실행 중 문제가 발생했습니다.');
    }
});

client.login(process.env.DISCORD_TOKEN);
