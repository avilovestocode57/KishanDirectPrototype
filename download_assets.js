import fs from 'fs';
import path from 'path';

const assets = [
  {
    name: 'main-bg.png',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhNEXhcw4OiWJA1V46r0eUklMowAVuJn2MT7o_xZN9hIx8j7zIqDU-hrtgjrHeL71lQsM2VD5aiI7tByWIhMfge5QF-W44NYqSK2UVxgR66cnjW_Y9ZTkuLvA4FcuIGvbyQ1sx7Ngru5N6IGfWvG48n8D5WqYpM0vE1JyCVF75-9enKjVrg_9k9Nxr9lo3MTX76pXMGYdgekwOR5y8ntCAvGivsHAQcTL8HvYACf05ASWd0P0DeSD2'
  },
  {
    name: 'farmer-card.png',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7K79GKOnYwZx9jISrchhn5OiNfK0QfaXZFt8D-ddJVi1PcdLJKPGfOpZSEkwBg7ucaRHO3kc1weOHwONApi0y5YNSpOl1-hADN4I2P8Zu1z1rXxZ2i6O7GngocYg5vzhVqZMCuHWA8ssX8vIMO4JS-5-iNZVZw7mBNIoKBeeLCie7xp6sPVjb6NweX3F4AqaR8cRHgMNEoUlTWkRB3xVLj_p-3aL4HhtiZ_UkC8VAeBImdYITMJ7o'
  },
  {
    name: 'consumer-card.png',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrnCEoXyBd9nIzvh5Wdpvt2D8oAGf6seIuMn8AqeULi9O7XCZHHjpjobc3Fz5O8ztHhRB8cF1cqchc4NXeUDI_v38YIxFdNO-N3BB4aVbJBJytWrcqOzseZIAn9Nm4lN7648DAyMF_MilCBqe5YbW5p3aiQIOATR3EvdSO8sRLO6y3dqJVOBYi3qc-L2wb4IjEnzhQeM8yMuAM4j2myZottVy2JoIOV2dyLw9zwpI5VkslN5pHKrj8'
  },
  {
    name: 'enterprise-card.png',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrUC_BdyVlr8A-4ubpKEQeL05PLJvLD_-C6RZf_LnxrqY0B_l8idQBToQbvaky-ednx4uH7In6QIxiHFd2pIl6xAemIVCNkxYq_tqz-fPeWqgXmrSbKVUaZi2h0upVSaVvvvXEbBOosSTyDuqAc4Qhn2H6w9-jSJ03S4yyw6BZC1po-iuYWSzXQlcFQjdAuO7a11yB3yrOCDZu4r15594K4UJQhIEo7eg7IaeRgFY0PV2c4NUQcxmW'
  },
  {
    name: 'admin-card.png',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzq2nGwZf3LRPYs6TYGSQGFMstitDXxw_1HEbUsbt-ukD3QNo0n5kWArvjitnlrpCJEF1Fa_BOew-ws55Y7F5qg0EG3Ljd3XQbfYRqPh5niuuNaCv5skM6aQqZ_f-fnS3xiT61CcFEkXDlzCuM16swMSL4mUSSglOwmMsQuER_g-akd1I3ZIIDIIxN_rQv6bBM8Xj6MlWMh9QBYG5QL5k4JpmXX0RfFKFRYt9DzAaGVcDatxlPfYkA'
  }
];

async function download() {
  for (const item of assets) {
    const dest = path.join('src', 'assets', item.name);
    console.log(`Downloading ${item.name}...`);
    const res = await fetch(item.url);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`Saved ${item.name} (${buffer.length} bytes)`);
  }
}

download().catch(console.error);
