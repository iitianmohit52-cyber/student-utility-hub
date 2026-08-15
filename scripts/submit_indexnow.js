import { submitToIndexNow } from '../src/utils/indexnow.js';
import { SITE_URL } from '../src/config.js';

const defaultUrl = `${SITE_URL}/`;
const urlsToSubmit = process.argv.slice(2).length > 0 ? process.argv.slice(2) : [defaultUrl];

console.log('Submitting URLs to IndexNow:', urlsToSubmit);

submitToIndexNow(urlsToSubmit)
    .then(success => {
        if (success) {
            console.log('Successfully submitted to IndexNow.');
            process.exit(0);
        } else {
            console.error('Failed to submit to IndexNow.');
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Unexpected error:', err);
        process.exit(1);
    });
