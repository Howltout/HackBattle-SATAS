document.addEventListener('DOMContentLoaded', function () {
    const sortButton = document.getElementById('sortButton');
    const subjectKeyword = document.getElementById('subjectKeyword');

    sortButton.addEventListener('click', async function () {
        const keyword = subjectKeyword.value.trim().toLowerCase();

        // Function to decode email subjects
        function decodeSubject(subject) {
            return subject;
            // You can add decoding logic here if needed
        }

        // Email categorization function
        function categorizeEmail(subject) {
            subject = subject.toLowerCase();
            if (/\b(spam|junk)\b/.test(subject)) {
                return "Spam";
            } else if (/\b(greetings|hello|happy)\b/.test(subject)) {
                return "Greetings";
            } else if (/\b(exam|test|quiz)\b/.test(subject)) {
                return "Examination";
            } else if (/\b(important|urgent|notice)\b/.test(subject)) {
                return "Important Notice";
            } else if (/\b(hostel|accommodation|mess)\b/.test(subject)) {
                return "Hostel";
            } else if (/\b(internship|job|career)\b/.test(subject)) {
                return "Internship/Job";
            } else if (/\b(abroad|overseas|study abroad)\b/.test(subject)) {
                return "Abroad Studies";
            } else if (/\b(achievement|award|recognition)\b/.test(subject)) {
                return "Achievements";
            } else {
                return "Other";
            }
        }

        // Email configuration
        const config = {
            user: 'your_email@gmail.com',
            password: 'your_password',
            host: 'imap.gmail.com',
            port: 993,
            tls: true
        };

        // Create an IMAP client
        const Imap = require('imap');
        const imap = new Imap(config);

        // Function to process emails with a specific keyword
        function processEmailsWithKeyword(keyword) {
            imap.openBox('INBOX', true, (err, mailbox) => {
                if (err) throw err;

                imap.search(['ALL'], (err, searchResults) => {
                    if (err) throw err;

                    searchResults.forEach((emailId) => {
                        const fetch = imap.fetch(emailId, { bodies: 'HEADER.FIELDS (FROM TO)' });
                        fetch.on('message', (msg, seqno) => {
                            msg.on('body', (stream, info) => {
                                let buffer = '';

                                // Read the email headers
                                stream.on('data', (chunk) => {
                                    buffer += chunk.toString('utf8');
                                });

                                stream.on('end', () => {
                                    // Parse the email headers
                                    const headers = Imap.parseHeader(buffer);

                                    // Extract sender's email address
                                    const fromAddress = headers.from[0];

                                    // Extract recipient's email address (To)
                                    const toAddress = headers.to[0];

                                    // Store or process emails based on email addresses
                                    if (fromAddress) {
                                        // Add your code to process or sort emails based on email addresses
                                        // For example, you can categorize and log them
                                        const subject = decodeSubject(headers.subject[0]);
                                        const category = categorizeEmail(subject);

                                        // Check if the email subject contains the keyword
                                        if (subject.includes(keyword)) {
                                            console.log(`Subject: ${subject}`);
                                            console.log(`Category: ${category}`);
                                            console.log(`From: ${fromAddress}`);
                                            console.log(`To: ${toAddress}`);
                                            console.log('---');
                                        }
                                    }
                                });
                            });
                        });

                        fetch.once('end', () => {
                            // Handle the end of fetching
                        });
                    });
                });
            });
        }

        // Connect to the IMAP server and process emails with the keyword
        imap.connect();
        imap.once('ready', () => {
            processEmailsWithKeyword(keyword);
        });

        // Handle errors
        imap.on('error', (err) => {
            console.error(err);
        });

        // Handle connection close
        imap.on('end', () => {
            console.log('Connection ended');
        });
    });
});
