from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Review

class Command(BaseCommand):
    help = 'Seeds the database with initial reviews.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding reviews...')

        # 0. Clear existing data to avoid duplicates
        Review.objects.all().delete()
        # We won't delete users, just get or create them

        # 1. Create or get users
        users_data = ['민준', '서연', '지훈', '하은', '도윤']
        users = []
        for username in users_data:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'password': 'password123'} # Set a default password
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created user: {username}'))
            users.append(user)

        # 2. Define reviews
        reviews_data = [
            {
                'user': users[0],
                'rating': 5,
                'text': '반신반의하면서 사용해봤는데, 결과가 생각보다 훨씬 정확해서 놀랐어요. 피부과 가기 전에 참고하기 딱 좋네요!'
            },
            {
                'user': users[1],
                'rating': 5,
                'text': '앱 디자인이 깔끔하고 사용법이 정말 간편해요. 사진 찍고 바로 결과 확인까지 1분도 안 걸리네요. 최고!'
            },
            {
                'user': users[2],
                'rating': 4,
                'text': 'AI가 분석해준다는 게 신기해서 사용해봤습니다. 추천해준 관리법도 유용할 것 같아요. 꾸준히 써보겠습니다.'
            },
            {
                'user': users[3],
                'rating': 5,
                'text': '매번 피부 상태가 궁금했는데, 이걸로 주기적으로 체크할 수 있어서 마음이 놓여요. 정말 유용한 앱입니다.'
            },
            {
                'user': users[4],
                'rating': 5,
                'text': '친구한테 추천받아서 써봤는데 대만족입니다. 주변에도 많이 추천하고 있어요!'
            },
        ]

        # 3. Create reviews
        for data in reviews_data:
            Review.objects.create(**data)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(reviews_data)} reviews.'))
