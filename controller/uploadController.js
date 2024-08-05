// import multer from 'multer';
// import Tesseract from 'tesseract.js';

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const extractTextFromImage = (buffer) => {
//   return new Promise((resolve, reject) => {
//     Tesseract.recognize(
//       buffer,
//       'eng',
//       { logger: (m) => console.log(m) }
//     ).then(({ data: { text } }) => {
//       resolve(text);
//     }).catch((error) => {
//       reject(error);
//     });
//   });
// };

// const uploadFacture = async (req, res) => {
//   try {
//     const text = await extractTextFromImage(req.file.buffer);
//     const extractedData = parseFactureText(text);
//     res.status(200).json(extractedData);
//   } catch (error) {
//     res.status(500).json({ message: 'Error processing image', error });
//   }
// };

// const parseFactureText = (text) => {
//   const lines = text.split('\n');
//   const data = {
//     factureNumber: extractField(lines, 'FACTURE N°'),
//     clientName: extractField(lines, 'Name'),
//     clientAddress: extractField(lines, 'Address'),
//     contactInfo: extractField(lines, 'contactinfo'),
//     dateOfInvoice: extractField(lines, 'Date de facture'),
//     dateOfDelivery: extractField(lines, 'Date de livraison'),
//     paymentConditions: extractField(lines, 'Conditions de reglement'),
//     paymentDueDate: extractField(lines, 'Echéance de paiement'),
//     totalAmount: extractField(lines, 'Montant Total').replace(/[^0-9.,]/g, '').trim(),
//     products: extractProducts(lines)
//   };
//   return data;
// };

// const extractField = (lines, keyword) => {
//   const line = lines.find(l => l.includes(keyword));
//   return line ? line.split(':')[1]?.trim() || '' : '';
// };

// const extractProducts = (lines) => {
//   const products = [];
//   let inProductsSection = false;

//   for (const line of lines) {
//     if (line.includes('ID Design Quantité')) {
//       inProductsSection = true;
//       continue;
//     }

//     if (inProductsSection && line.trim() === '') {
//       inProductsSection = false;
//       continue;
//     }

//     if (inProductsSection) {
//       const parts = line.trim().split(/\s+/);
//       if (parts.length >= 7) {
//         products.push({
//           id: parts[0], // ID part
//           description: parts.slice(1, parts.length - 5).join(' '), // Description part
//           quantity: parts[parts.length - 5], // Quantity part
//           reference: parts[parts.length - 4], // Reference part
//           codeFamille: parts[parts.length - 3], // Code Famille part
//           category: parts[parts.length - 2], // Category part
//           price: parts[parts.length - 1], // Price part
//           subtotal: parts[parts.length - 1], // Subtotal part
//         });
//       }
//     }
//   }

//   return products;
// };

// export { upload, uploadFacture };
import multer from 'multer';
import Tesseract from 'tesseract.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const extractTextFromImage = (buffer) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      buffer,
      'eng',
      { logger: (m) => console.log(m) }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch((error) => {
      reject(error);
    });
  });
};

const uploadFacture = async (req, res) => {
  try {
    // Extract text from image
    const text = await extractTextFromImage(req.file.buffer);
    console.log('Extracted Text:', text); // Log extracted text

    // Parse the extracted text
    const extractedData = parseFactureText(text);
    console.log('Parsed Data:', extractedData); // Log parsed data

    // Respond with the extracted data
    res.status(200).json(extractedData);
  } catch (error) {
    console.error('Error processing image:', error); // Log error if any
    res.status(500).json({ message: 'Error processing image', error });
  }
};

const parseFactureText = (text) => {
  const lines = text.split('\n');
  const data = {
    factureNumber: extractField(lines, 'FACTURE N°'),
    clientName: extractField(lines, 'Name'),
    clientAddress: extractField(lines, 'Address'),
    contactInfo: extractField(lines, 'contactinfo'),
    dateOfInvoice: extractField(lines, 'Date de facture'),
    dateOfDelivery: extractField(lines, 'Date de livraison'),
    paymentConditions: extractField(lines, 'Conditions de reglement'),
    paymentDueDate: extractField(lines, 'Echéance de paiement'),
    totalAmount: extractField(lines, 'Montant Total').replace(/[^0-9.,]/g, '').trim(),
    products: extractProducts(lines)
  };

  return data;
};

const extractField = (lines, keyword) => {
  const line = lines.find(l => l.includes(keyword));
  return line ? line.split(':')[1]?.trim() || '' : '';
};

const extractProducts = (lines) => {
  const products = [];
  let inProductsSection = false;

  for (const line of lines) {
    if (line.includes('ID Design Quantité')) {
      inProductsSection = true;
      continue;
    }

    if (inProductsSection && line.trim() === '') {
      inProductsSection = false;
      continue;
    }

    if (inProductsSection) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 7) {
        products.push({
          id: parts[0], // ID part
          description: parts[parts.length - 7], // Description part
          quantity: parts[parts.length - 6], // Quantity part
          reference: parts[parts.length - 5], // Reference part
          codeFamille: parts[parts.length - 4], // Code Famille part
          category: parts[parts.length - 3], // Category part
          price: parts[parts.length - 2], // Price part
          subtotal: parts[parts.length - 1], // Subtotal part
        });
      }
    }
  }

  return products;
};

export { upload, uploadFacture };
