import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const permissions = [
	'album',
	'campaign',
	'deceased',
	'financial',
	'image',
	'item',
	'item_category',
	'item_history',
	'item_location',
	'location',
	'member',
	'org_structure',
	'organization',
	'period',
	'post',
	'report_financial',
	'report_item',
];

async function main() {
	for (let i = 0; i < permissions.length; i++) {
		await prisma.permissions.upsert({
			where: { name: permissions[i] },
			update: {},
			create: {
				name: permissions[i],
			},
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
