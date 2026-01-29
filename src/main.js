/**
 * Main entry point for 測試程式開發
 */

function main() {
  console.log('Hello from 測試程式開發!');
}

module.exports = { main };

// Run if executed directly
if (require.main === module) {
  main();
}
