export const scamQuizQuestions = [
  {
    id: 1,
    scenario: 'You get a text message from what looks like your bank. It says: "Your account has been locked due to suspicious activity. Click here to verify your details now or your account will be closed."',
    options: [
      'Click the link quickly to protect your account',
      'Reply to the message asking if it is real',
      'Ignore the link. Open your banking app yourself or call the number on the back of your bank card',
    ],
    correctIndex: 2,
    explanation: 'This message creates pressure by saying your account will be closed. Scammers use urgency to make you act fast without thinking. Your real bank will never ask you to click a link in a text to fix your account. Open your bank app yourself or call the number printed on your bank card.',
    warningSign: 'The message demands urgent action and includes a link.',
  },
  {
    id: 2,
    scenario: 'You get a text saying: "Australia Post: Your parcel could not be delivered. Click the link to update your address and pay a $3.99 redelivery fee."',
    options: [
      'Click the link and pay the fee so you get your parcel',
      'Call the number in the message to ask about your delivery',
      'Do not click the link. Go to the Australia Post website yourself by typing auspost.com.au',
    ],
    correctIndex: 2,
    explanation: 'Australia Post will never ask you to pay a fee by clicking a link in a text message. The link may take you to a fake website that steals your card details. Always check deliveries by going to the official website yourself.',
    warningSign: 'A delivery message asks for payment through a link.',
  },
  {
    id: 3,
    scenario: 'You get an unexpected call from someone saying they are from Telstra. They say your internet has been hacked and your personal details are at risk. They ask you to download an app so they can fix your computer remotely.',
    options: [
      'Download the app because the problem sounds serious',
      'Give them your details so they can verify who you are',
      'Hang up. Do not download anything. Call Telstra yourself using the number on their official website',
    ],
    correctIndex: 2,
    explanation: 'Real companies do not call you unexpectedly and ask you to download software to fix your device. If you give remote access, scammers may see your screen, access accounts, or steal money. Hang up and contact the company yourself using the official website.',
    warningSign: 'An unexpected caller asks you to download software or give remote access.',
  },
  {
    id: 4,
    scenario: 'You get an email that looks like it is from myGov. It says your account needs to be verified and asks you to click a link and enter your name, date of birth, and Medicare number.',
    options: [
      'Click the link and fill in your details to keep your myGov account active',
      'Forward the email to a family member to ask if it looks real',
      'Do not click the link. Go to my.gov.au yourself in your browser and log in there',
    ],
    correctIndex: 2,
    explanation: 'This is a fake email designed to collect your personal details. If you enter your details, scammers may use them to steal your identity or access services. Always go to official websites by typing the address yourself.',
    warningSign: 'An email asks you to click a link and enter personal details to verify your account.',
  },
  {
    id: 5,
    scenario: 'You get a WhatsApp message from an unknown number. It says: "Hi Mum, it\'s me. I broke my phone and this is my new number. I\'m in trouble and need you to send $500 urgently. I\'ll explain later."',
    options: [
      'Send the money quickly because your child sounds distressed',
      'Reply to the new number to ask more questions',
      'Do not send money. Call your child on their real number that you already have saved',
    ],
    correctIndex: 2,
    explanation: 'Scammers may pretend to be your child or grandchild using a new number. They rely on worry and urgency to make you send money quickly. Call your family member on the number you already have saved before doing anything.',
    warningSign: 'A message from an unknown number claims to be family and asks for money.',
  },
]
