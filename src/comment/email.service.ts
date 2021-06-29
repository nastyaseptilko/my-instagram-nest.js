import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { SendEmailPayload } from 'src/comment/interfaces/email.interfaces';

const EMAIL_SEARCH_REGEX = /@((([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))([\W]|$)/gm;

@Injectable()
export class EmailService {
    private nodemailerTransport: Mail;

    constructor() {
        this.nodemailerTransport = createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    public async searchEmails(text: string): Promise<string[]> {
        const emailSearchResult = text.match(EMAIL_SEARCH_REGEX);

        if (emailSearchResult) {
            return emailSearchResult.map(searchResult => searchResult.substring(1));
        } else {
            return [];
        }
    }

    public async sendEmails(sendEmailPayload: SendEmailPayload) {
        if (sendEmailPayload.emails.length !== 0) {
            return await this.nodemailerTransport.sendMail({
                from: 'Instagram support <nodejs@example.com>',
                to: sendEmailPayload.emails,
                subject: 'Mentioned in a comment',
                html: sendEmailPayload.text,
            });
        }
        return;
    }
}
