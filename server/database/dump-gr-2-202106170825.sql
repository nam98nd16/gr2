PGDMP                         y            gr-2    12.1    12.1 E    g           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            h           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            i           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            j           1262    28415    gr-2    DATABASE     �   CREATE DATABASE "gr-2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE "gr-2";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            k           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    28418    accounts    TABLE     �  CREATE TABLE public.accounts (
    username character varying NOT NULL,
    "userId" integer NOT NULL,
    password character varying NOT NULL,
    "fullName" character varying,
    address character varying,
    "phoneNumber" character varying,
    autobiography character varying,
    email character varying,
    role smallint DEFAULT 3 NOT NULL,
    "subjectId" smallint,
    birthday date,
    gender smallint,
    "avatarImagePath" character varying
);
    DROP TABLE public.accounts;
       public         heap    postgres    false    3            �            1259    28416    accounts_userId_seq    SEQUENCE     �   CREATE SEQUENCE public."accounts_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."accounts_userId_seq";
       public          postgres    false    3    203            l           0    0    accounts_userId_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."accounts_userId_seq" OWNED BY public.accounts."userId";
          public          postgres    false    202            �            1259    28438    answers    TABLE     �   CREATE TABLE public.answers (
    "questionId" bigint NOT NULL,
    "answerId" bigint NOT NULL,
    "answerString" character varying NOT NULL
);
    DROP TABLE public.answers;
       public         heap    postgres    false    3            �            1259    36729    friends    TABLE     �   CREATE TABLE public.friends (
    "friendId" bigint NOT NULL,
    "userId1" integer NOT NULL,
    "userId2" integer NOT NULL,
    confirmed bit(1) NOT NULL,
    "dateConfirmed" timestamp with time zone,
    "dateRequested" timestamp with time zone
);
    DROP TABLE public.friends;
       public         heap    postgres    false    3            �            1259    36727    friends_friendId_seq    SEQUENCE        CREATE SEQUENCE public."friends_friendId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."friends_friendId_seq";
       public          postgres    false    3    215            m           0    0    friends_friendId_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."friends_friendId_seq" OWNED BY public.friends."friendId";
          public          postgres    false    214            �            1259    28494    peer_review_results    TABLE     �   CREATE TABLE public.peer_review_results (
    "questionId" bigint NOT NULL,
    "reviewerId" integer NOT NULL,
    "hasApproved" bit(1),
    "hasRejected" bit(1),
    "rejectReason" character varying
);
 '   DROP TABLE public.peer_review_results;
       public         heap    postgres    false    3            �            1259    28430 	   questions    TABLE       CREATE TABLE public.questions (
    "questionId" bigint NOT NULL,
    "subjectId" smallint NOT NULL,
    "answerId" bigint NOT NULL,
    "questionString" character varying NOT NULL,
    "creatorId" integer NOT NULL,
    "difficultyLevel" smallint NOT NULL,
    "timeAllowed" smallint NOT NULL,
    "passedPreliminaryReview" bit(1),
    "passedFinalReview" bit(1),
    "passedPeerReview" bit(1),
    "hasBeenReported" bit(1),
    "hasBeenAssigned" bit(1),
    "hasBeenRejected" bit(1),
    "rejectReason" character varying
);
    DROP TABLE public.questions;
       public         heap    postgres    false    3            �            1259    36712    rated_test_results    TABLE       CREATE TABLE public.rated_test_results (
    "userId" integer NOT NULL,
    "questionId" bigint,
    "answeredId" bigint,
    "submittedTime" timestamp with time zone NOT NULL,
    "ratingChange" real NOT NULL,
    "subjectId" smallint NOT NULL,
    "updatedRating" real NOT NULL
);
 &   DROP TABLE public.rated_test_results;
       public         heap    postgres    false    3            �            1259    36667    ratings    TABLE     �   CREATE TABLE public.ratings (
    "userId" integer NOT NULL,
    "subjectId" smallint NOT NULL,
    rating real,
    "lastUpdate" timestamp with time zone
);
    DROP TABLE public.ratings;
       public         heap    postgres    false    3            �            1259    28518    reports    TABLE     �   CREATE TABLE public.reports (
    "questionId" bigint NOT NULL,
    "reporterId" integer NOT NULL,
    reason character varying NOT NULL
);
    DROP TABLE public.reports;
       public         heap    postgres    false    3            �            1259    28446    subjects    TABLE     r   CREATE TABLE public.subjects (
    "subjectId" smallint NOT NULL,
    "subjectName" character varying NOT NULL
);
    DROP TABLE public.subjects;
       public         heap    postgres    false    3            �            1259    36724    subjects_id_seq    SEQUENCE     w   CREATE SEQUENCE public.subjects_id_seq
    START WITH 9
    INCREMENT BY 1
    MINVALUE 9
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.subjects_id_seq;
       public          postgres    false    3    206            n           0    0    subjects_id_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects."subjectId";
          public          postgres    false    213            �            1259    36648    test_results    TABLE     w  CREATE TABLE public.test_results (
    "testTakerId" integer NOT NULL,
    "startTime" timestamp(4) with time zone NOT NULL,
    "subjectId" smallint NOT NULL,
    "questionCount" smallint NOT NULL,
    "correctAnswerCount" smallint NOT NULL,
    "testId" character varying NOT NULL,
    "difficultyLevel" character varying NOT NULL,
    "totalTimeSpent" integer NOT NULL
);
     DROP TABLE public.test_results;
       public         heap    postgres    false    3            �            1259    36646    test_results_testTakerId_seq    SEQUENCE     �   CREATE SEQUENCE public."test_results_testTakerId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public."test_results_testTakerId_seq";
       public          postgres    false    3    210            o           0    0    test_results_testTakerId_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public."test_results_testTakerId_seq" OWNED BY public.test_results."testTakerId";
          public          postgres    false    209            �
           2604    28421    accounts userId    DEFAULT     v   ALTER TABLE ONLY public.accounts ALTER COLUMN "userId" SET DEFAULT nextval('public."accounts_userId_seq"'::regclass);
 @   ALTER TABLE public.accounts ALTER COLUMN "userId" DROP DEFAULT;
       public          postgres    false    202    203    203            �
           2604    36732    friends friendId    DEFAULT     x   ALTER TABLE ONLY public.friends ALTER COLUMN "friendId" SET DEFAULT nextval('public."friends_friendId_seq"'::regclass);
 A   ALTER TABLE public.friends ALTER COLUMN "friendId" DROP DEFAULT;
       public          postgres    false    214    215    215            �
           2604    36860    subjects subjectId    DEFAULT     s   ALTER TABLE ONLY public.subjects ALTER COLUMN "subjectId" SET DEFAULT nextval('public.subjects_id_seq'::regclass);
 C   ALTER TABLE public.subjects ALTER COLUMN "subjectId" DROP DEFAULT;
       public          postgres    false    213    206            �
           2604    36651    test_results testTakerId    DEFAULT     �   ALTER TABLE ONLY public.test_results ALTER COLUMN "testTakerId" SET DEFAULT nextval('public."test_results_testTakerId_seq"'::regclass);
 I   ALTER TABLE public.test_results ALTER COLUMN "testTakerId" DROP DEFAULT;
       public          postgres    false    209    210    210            X          0    28418    accounts 
   TABLE DATA                 public          postgres    false    203            Z          0    28438    answers 
   TABLE DATA                 public          postgres    false    205            d          0    36729    friends 
   TABLE DATA                 public          postgres    false    215            \          0    28494    peer_review_results 
   TABLE DATA                 public          postgres    false    207            Y          0    28430 	   questions 
   TABLE DATA                 public          postgres    false    204            a          0    36712    rated_test_results 
   TABLE DATA                 public          postgres    false    212            `          0    36667    ratings 
   TABLE DATA                 public          postgres    false    211            ]          0    28518    reports 
   TABLE DATA                 public          postgres    false    208            [          0    28446    subjects 
   TABLE DATA                 public          postgres    false    206            _          0    36648    test_results 
   TABLE DATA                 public          postgres    false    210            p           0    0    accounts_userId_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."accounts_userId_seq"', 76, true);
          public          postgres    false    202            q           0    0    friends_friendId_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."friends_friendId_seq"', 250, true);
          public          postgres    false    214            r           0    0    subjects_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.subjects_id_seq', 34, true);
          public          postgres    false    213            s           0    0    test_results_testTakerId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public."test_results_testTakerId_seq"', 1, false);
          public          postgres    false    209            �
           2606    28426    accounts accounts_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY ("userId");
 @   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pkey;
       public            postgres    false    203            �
           2606    28428    accounts accounts_unique 
   CONSTRAINT     W   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_unique UNIQUE (username);
 B   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_unique;
       public            postgres    false    203            �
           2606    28485    answers answers_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY ("answerId");
 >   ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey;
       public            postgres    false    205            �
           2606    36734    friends friends_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY ("friendId");
 >   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_pkey;
       public            postgres    false    215            �
           2606    28500 ,   peer_review_results peer_review_results_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.peer_review_results
    ADD CONSTRAINT peer_review_results_pkey PRIMARY KEY ("questionId", "reviewerId");
 V   ALTER TABLE ONLY public.peer_review_results DROP CONSTRAINT peer_review_results_pkey;
       public            postgres    false    207    207            �
           2606    28455    questions questions_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY ("questionId");
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    204            �
           2606    36671    ratings ratings_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY ("userId", "subjectId");
 >   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_pkey;
       public            postgres    false    211    211            �
           2606    36862    subjects subjects_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY ("subjectId");
 @   ALTER TABLE ONLY public.subjects DROP CONSTRAINT subjects_pkey;
       public            postgres    false    206            �
           2606    36896    test_results test_results_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT test_results_pkey PRIMARY KEY ("testId");
 H   ALTER TABLE ONLY public.test_results DROP CONSTRAINT test_results_pkey;
       public            postgres    false    210            �
           2606    36863     accounts accounts_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 L   ALTER TABLE ONLY public.accounts DROP CONSTRAINT "accounts_subjectId_fkey";
       public          postgres    false    2750    203    206            �
           2606    36902    answers answers_questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.answers DROP CONSTRAINT "answers_questionId_fkey";
       public          postgres    false    2746    205    204            �
           2606    36740    friends friends_userId1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "friends_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES public.accounts("userId") NOT VALID;
 H   ALTER TABLE ONLY public.friends DROP CONSTRAINT "friends_userId1_fkey";
       public          postgres    false    215    203    2742            �
           2606    36745    friends friends_userId2_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "friends_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES public.accounts("userId") NOT VALID;
 H   ALTER TABLE ONLY public.friends DROP CONSTRAINT "friends_userId2_fkey";
       public          postgres    false    215    2742    203            �
           2606    36750 7   peer_review_results peer_review_results_reviewerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.peer_review_results
    ADD CONSTRAINT "peer_review_results_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public.accounts("userId") NOT VALID;
 c   ALTER TABLE ONLY public.peer_review_results DROP CONSTRAINT "peer_review_results_reviewerId_fkey";
       public          postgres    false    207    2742    203            �
           2606    28513 #   peer_review_results questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.peer_review_results
    ADD CONSTRAINT "questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 O   ALTER TABLE ONLY public.peer_review_results DROP CONSTRAINT "questionId_fkey";
       public          postgres    false    204    207    2746            �
           2606    28532    reports questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 C   ALTER TABLE ONLY public.reports DROP CONSTRAINT "questionId_fkey";
       public          postgres    false    208    204    2746            �
           2606    36835 "   questions questions_creatorId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.accounts("userId") NOT VALID;
 N   ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_creatorId_fkey";
       public          postgres    false    203    204    2742            �
           2606    36883 "   questions questions_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 N   ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_subjectId_fkey";
       public          postgres    false    2750    204    206            �
           2606    36912 5   rated_test_results rated_test_results_answeredId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_answeredId_fkey" FOREIGN KEY ("answeredId") REFERENCES public.answers("answerId") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 a   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_answeredId_fkey";
       public          postgres    false    212    205    2748            �
           2606    36907 5   rated_test_results rated_test_results_questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 a   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_questionId_fkey";
       public          postgres    false    212    204    2746            �
           2606    36868 4   rated_test_results rated_test_results_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 `   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_subjectId_fkey";
       public          postgres    false    2750    212    206            �
           2606    36770 1   rated_test_results rated_test_results_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts("userId") NOT VALID;
 ]   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_userId_fkey";
       public          postgres    false    212    203    2742            �
           2606    36873    ratings ratings_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "ratings_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 J   ALTER TABLE ONLY public.ratings DROP CONSTRAINT "ratings_subjectId_fkey";
       public          postgres    false    206    211    2750            �
           2606    36790    ratings ratings_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts("userId") NOT VALID;
 G   ALTER TABLE ONLY public.ratings DROP CONSTRAINT "ratings_userId_fkey";
       public          postgres    false    211    2742    203            �
           2606    36800    reports reports_reporterId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public.accounts("userId") NOT VALID;
 K   ALTER TABLE ONLY public.reports DROP CONSTRAINT "reports_reporterId_fkey";
       public          postgres    false    2742    203    208            �
           2606    36878 (   test_results test_results_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT "test_results_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 T   ALTER TABLE ONLY public.test_results DROP CONSTRAINT "test_results_subjectId_fkey";
       public          postgres    false    210    206    2750            �
           2606    36805 *   test_results test_results_testTakerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT "test_results_testTakerId_fkey" FOREIGN KEY ("testTakerId") REFERENCES public.accounts("userId") NOT VALID;
 V   ALTER TABLE ONLY public.test_results DROP CONSTRAINT "test_results_testTakerId_fkey";
       public          postgres    false    203    210    2742            X   �  x��Wɒ����WhQiGT1���A 1	i����A����{�{����?��tV�Ѯȩ�6B/���9�^I��1�C������y�5��b��B���>sR�ʼ��3��<���?�Ч��8PhK�h5��X��4(!�z��s��ճ����{�YA$�^��W�v���d3뷟���<<���3�<S�_����E��Ό*΢ϳ����f�%���B4��4����:�n��&��N|�|���h��OW��0N�Я�d�=����۝����LD~���-\V�/ў�U@���I���Ce8�%��<��n�?��}:m�y6�������l�Q�1�������w��}b��i��}���ަ�od
F&d$��U,
'���8��p����p�(n�:?A�-��ݻ$�8Z���X����3����_���\#����g��2�+"��4J��*�CRo��G�MGIJ�R@y�,�Q�$8��
x*����L�&��¯x!�4H��ڲp�\k��P����5T㬄$D������Ł����*~�'��+!>E��=j�o�9�I� ���,���1�]Su�E1����2���|���3����#��_ �=�扚U�� )^O�$?j���)�-�=p(��Q6[����.�F�8�(��j��ҁ���FF�?�)O�@�G7��9m��
i�8�������{hg/��+ao��2z0{I;�c��q�$�jr� }��e��!8�dgA�Xf9.�"��]�`�ƹ�2Zw;p�E��*�����ߤ%.Wl����51�Ǎx8�@;l�2��{bl��M'�̣�X�*S(6Ş�L��]"r6TR�8�	TF�b.��Т4j#���'B�NF*��˱�A��Eh�K�dN-%j��c��N��	�@�U�\�]``���b��}���a	�?�[����
�ll���60ș�	dUXF5��È����J�\���NҖ�~�)���� �3��+iS���+���T�����ݭI2tω��<���vHț���oG��xǾֺǄ���u��qU��u�L3+yCO�8�,���g��,<o�E���f��f�x@: 7 EU��z��	?Qqcp�z
���B�A2hYn3/ �K-=�6]��۱���>DG �� ��פ&�~�~����%�P"�4F���zߐ��Z&[����	��KϿt'eه�G��&����A�|��d<�$�T��K� `jNiUo��%Us� �qP��g 4��X���'ca7-2�*Z�a=��%�-�� � yv �^BV��}�&|��z�Z���q��5�c�'�M}~C�E�(����TX�_�%�Tx4����f���N	��*��XD���臝&�W�S�߈M���t#�6�0�����XI/Ԗ���^��3)h E6�,P��S�Q�σǃho�~�3Wc��l*����t��qsR�I�3��x���]\K���{��j`��͐nE`�b��R�:�}�Xy�qo'�+[������[8g^�)v�f/K~�e>�ꃳnJ���A�9�A�~�r-Y�����l����-���i,���+�(��`�h��k�QG�!i��vay�dsMF����M�A�����Zk��N��~m�&��7h�k��m���e�;��]��>�J�cV���1�pz�c��a�h��xj�Z��Os��� �      Z   A
  x����n�FE����)���d�������2"Y�$��߇lRb��^�.���X}����y����_?޾�����׏���8~~�vzx<���Ͽ�y��&��+��ׇ���ν>\٫�|��g���v2���;qb%#F��$��Ȅ?�Q ���Q�O��+U�dT��Gǰzt��#����G� ��1}tJI0b���0�`d��(�?�`d�)} ��0(} ��G����`T��b �2���Q����9�Q�T<O�s>����>��} ��G5fcԚ,O;O;O;O��r��K-g�� �a|
�w�L�8�p&�]�/`Gb����[LV���0<�`�Q0Bm����(�?�Q�3�a��#O�o;1�����c��j�`䜩X*������br��?�A�`PcL�"GY�S ��?����`�+r�u�0��xA3^����(br���Y�� �1{-iJM;!m�^��c�-��-���ױT��s��z��KX���H�+�s����x�' 	�O ��m�8��5j�O b��X�'q�OD���y*�"����b,B����L�C�G�P�!T�G��H^)�� �N �� �N���Ulj� $S>H�|������>/�E�'I�O�� �P>��9*#����r1B�\\EB�%�=4�O R(� �R>9�$��I5b{fG�B�B�B�j�u�m"��p>��p>q�'bl!bl!bl!b��`��|G� ��	@�( �"��"��"��"��[a���p:��p:��㓩bJɕp��B8��\ıJ�35WZ}n�6������s9m��B֟��_F��������e�G��	b܄d*Q~��r�n�Wb�oް��=��X[m��M&���j��M��k+�^�.3k�Ӄ"�F_*1'�9'F��*)
�L�@��V�-�.��bŢZ1���[Nؚ}��T�v�O��>0�c[�{��T���j���XSM�m�kn/GT��x����ӃA@�*6�%I@���D�d9�R��؜��㬓Tc�u�e��AE�s�5�Rf*a`֡Rf*c�a�c�u�%�>���}֡&��u�E�%�u(��؈��^l��l/6�bC�q:�q���ب�,q�X߉����Y0� �Z_W�p5�8�Nq_������ؠ�)�%P�0��+qe�y��e	�8�%]���#�X*PC�-T}�1��B���c���>�R����u1�qlٸxr�27ہ���X�l��<�n.
���wAd�f�0yc�,��FY�b�z����Al���qU��ˀ 6.��2e	�MkI�&�e�`i�Z��H���<N>d(���#��s5���Iy�e��]Gq�_���Kk��v;�+�wQ^�2tWk�2f(���j\C��6Y{=x�P^e2f����1��b�κd�_V��������j�總�$2���!�>�E0�k���@{��������QD��<����%�h���+��/�%���%�O�`�%Y��}[�s��\U�T�i�!#>E�[F����-h]��Z��¡փ�J�P����eh=��k]yc�1.~�ƨX�b2h����1j̝kL�陡�(;@c�]J?/1/wǞ�vٯQ CH;���.���6{_��}�9f�8c���0f��c���q�P5��g�c��ƌ��"�sI0R��+�*�E���l7�d�����`��'zK�&���Է3����g&���]�X��`�P�.�ڐ$�ߎR":�M=ET���(����'��ch��%��qJ^{�w(y�O���\����
��H>3���h�'g��|�]ۿiU�Ғb��-���:Uk��I@b\>���$H�m�'kE0��$1�X# 5F�.��ʫ��\�̧��;�s��vY��o��-2��fƒ.�K#]t��Wfcp�J,����u�U{8h\u��qp��W&�̈բNf�,������Pg�t���D�u�(�������Q]2����'����9�R�rx�,��=x9L�JX��#QM@o��W��c��@)�1���*j@hm�W+M{�l(�L��E�Ѥ�Ҩ�R��yJ��%�5�Qǡ�(у�,^Ak�	 �B��Zf�Q�=T�e�i)!�v }k/�9�}ډ�m�>~��z:?���C���������K ��}|PQ�k]��Ki�������t3��.V;%s������Owǧ���;y�ٶ������q'n��������ib~<=};�t�����v�ˇ��z���/ǧ�E��O;qM���_??���I+�q�O��I��n�����n�D	�u���g.��YG˼�j2ޮ�Yk�.7A	x����1�)�L��۽m�u�si���fW��Q�\+(��CJ��~��+>D%��B���ָ�+=CypjȘ=�8u]�4��ό�mjP☟k˒/m�\P�K����C��0#�K0��|������a�(�a�P�6CM�ֵ
_�Ay�{�P�2���2t��Ɵ3�*�?g������@���ի� �AN�      d   7  x��S�JCA��+��_��fkO
9B��n��wƧ��20sj�����/W�۵�/�7����e� ��ۧ��ww���Vz�S�8��îw��bѻ��i�:%t��h� �\`��/'�qh�V�'9��1��BR:4S,��W5u;z�0�F��+��ԛPi��J�#F�
-(��r��?�gT6.�YO�+��T0��<̐"��4L1�($�>i)�ʨO"%# n(�-t���T�'�B-�2Dp�PR+S���[�a*�<RC2u�	�����<c:���T=�k0x��T�0FH{+�����ߎ��5F�      \   U  x���;kW��^�b;%`��ٹ/\9�B ����]o}���Ti����s��c�����?�O7w��>?�������_�������������?��_�n߾~s�%�T��9�8-��߯������������ǈU�R�r�+1Ĵ�����x9]���\����������ߥTĔ!�����'VNl��5�5ӧ���L3'�91s�׵��>i�[O�֓��3�u��\ׅǞ�u]t��[Oѹ�wn��ˈ�qM��W"�f+[�J�����Dl�+�c�.��e�>���d�3W{+����)V"�G]�Ľ0�w�+|���N�x֟����Q���1QϤF��^3��G7��\י{a��\3EG�ѻ�Ws�)�ع�t�G�)��ib"��ib"�)���Dl��iZ��e\�����}&s�ɸ�����5%&]�E�J}&v�r7�vI�M�%Nl��5�_�\K���\K��czm�^��c�j�\יk&s�d{b�j/�x�(\�E�ػRb��3�����gےZ"�=ۖ��=n[RK���mI)q�2.\��-<sϸ��v���-\��m�)���L�4)1�
 �q��zk?^mg �j^��S�����\�}��x&6zY2�W�Y�|��r��L,M�͆�t�����Q��(c� z���,�Q� ʺ���PE^x�A�G�_EZ�8>l��ӡ^F`ӡ,!��a\�>{��+�[�</�&���(��o���Svn:�f^���m��Y{�Ή��;����Aw��q_��TJ�Ϲ
?Z��¨R0Qi�����yOR�GM!cx�$1�=�gt�<b<�ҟ�{0Q���|mG���/ŋ_L�E�a��/����g¯�P���~�{��51:v�d|<��~��bx���=�Y@{�=W���Ã�'�.�"Rh��$7�Z�Frv/����q��sa�?�u��_��c��A�R�bG����kv�1�̾�Iܞ]������3�#��<���GLԙ+�%����#��~���V)�W���j���N�-{�&�و?AFg=S�cne܈� � 8-L4����� *Ѻgߒ��ݰ����������      Y   �  x�ś�n7����ն�a�r�DQ-��[4N�^����ʒ#����;�갣��کa�{-~�93|~���/W����'󰾞�ݜ�_���n1_��?\�y��|�С�)y:5�?w��I�&�|g�oN���{j~l\s�j��|sq�ͷ'�ObȒ!���A2@�: 
@�Y�![7dȖ���<?Gc /���A]�: ���C�^2xK�΀�Du�(B�V�!I"Ҏ�l�d�ު�����YĤ� ��yk��"J��!�F�<�/1GE�1�ꓺ2."EG�2.b?:��hC�Re��}�dΩ�$�����$!k3d��!R��4I��8b��R�L!u�r�%ch2p-��:�p�.���^2x e��F�d����%CHV9.��N2�zS_�����!�-Y��	�3����Q�C �A�!K�D���`��_��2�<]�5�.HO^�A���T�2O��Ju�� ��!�3�،��?8����B��$xt`�\��>L1�֓��J.��:��Q����d��@2����!@�(�P2�D�� �C,�K�2?8���C94�8u᭼?��ؗK�i�%�sr��-:����S���b
;�&�J��� Nb�6j�'�<X�1ՠx���<]�Leq�"3��ʦ��aB�9�#��HT�6��@���86C��!Sݭ�ep�!9��!דf]Hꀄ��$C��>I^�$��&�0	����X}�A�౞�<Z�')��
Hs���Є4�*k�R�Kk�>)�d�9��P2 �u7J�'ɓ�r٩3�d@[ΖT�M2.88�r\$g%C�5G�2�y3mo?�2x��dNe�P�u��d�4uH\��=���ݘ���_ksvvf���_��t�w+�}��>�=�Y���q�tyOV�~%�\ݶ�fq�0�2�Ǉ��[�naVmk~���e;����ι�̔W�榝w���v�l�l�Z��9��忽Y�C���e�.Ϙ��n�q��"n׽XTk2�y�xh��'�M?��]���z�����vd�{e_|h��٬<n�����S7�P�YQH�O����Ħ+�ҧ�v�\1�#?�M_~y�\�h|�\-�}��19�U5��	��b�/�zӦP�X<��)�}*�xp�㈞�Mc�C�b�m� 6�(q��k}(��XN�T��DAYĨ:��Y��ZH�%u��  �>HO�^��,\�]�A.f ��]�I6�mzݸ ��"Ʃ�f�>� 4�82r�n���is=�⹂�ps�;ڌ�s�/�6f�㰙2����g����(��h����p���)��}���J�2�͔��4`k�z��VOן���������F�o�P�p�.?ّ����̬W���cs4�`�)x�iw�y�c��D�#��n�6f��X�1ۇ����$ؚ�n}�*�,99�a��1      a      x��}K�l;n�ܿ�̜ �n�")J_Fx`�����ȣ<��������W�K��&�d7|�k=�E�\��?������������������������������������/������������������b��$H1��������"���� �"|q��	��
[�(���7
���?�׿��iA�����������2�~���A@d����Q�⏧�~�B����p�����0�گ���y�ǯg!Ĕ����Ph���w?��7��~>������I8b^[{ �R�#��/����@ہr,뇯���#�=k�(��N!$!Z܈�E��"
ޤt�^����/b��
�50e�H��r���-E�ߺ#��@��z�&E �%��@����(�Ʃ�HȨ�K�Q(g^<�o����VJ:tJ���v(�'���w�_��=��І|	��67A�d�c��5L��J,���d�,��
[�x� �	�4��z��o���R��.�� RLj�?O9l|ج��[oj���WoH��1/*�V�[� �N�bz�`�s��(Y��#���#9�I�^n�,�W�+ �T���i`�D�r��tr��;�Gݒϯ��nb� B̼!�o00��ޔzC
�n���nm7�_�q��l1��HK[
�L���R��V��"R�R��( q���,_�����P+_�ӥ�(�}�u��w��lx�PB�#� 0p��ۡ?�)��UQ��t\Q� ;�SD�&�o��R�C����^���� ����d(�9���9t��mC���	��Q��	���G��JР��Ĥ~	��`�πV���� E�K*�8�����3f�C'��a���jThL�s[����EB,��(8}E�?��	usb�W9*�5�y�с����.�2�vG5>^sb�a��O���nD����@J�`����#�T��]�@y��]�nf���(-������P�p�۠6k}^G�퀃RA�����Q���y�����>��)���"�ؖ���o��������Fj�K#wI@-�
��00؆����M� X��"j<ţU�G4��4/�"��7�̔�;�$9[	T8��Ɂ�g���T(wI����퐤t�G��p! 6r�i��gr���xm����"��P���Q��i�z��F������=��R�Y�90�و�a0���DMQԥ���]��ۺ��9�5�y�u06���'��'�zN=�n�,��V �D��m�@���Fxs�A(͖�ax���oi�OP���/���Šf���d=���{�[��.��b�ǐ�0Цf���4�+�N`�t��%��b>@�hؽ���M>w�i��W�j")ѱTrYJ�]��������UN���`3ً��eO���1
K[y ��J�v����R\���|��K��Qh4>�H~{)@�T�\N�� ���kf��R$%q�%%=�w�R����뿿槎�Ij����=2��#Ǜ��|Ÿ<6��PDlFSC����5�vM�A�FE}gC�4���ce�.]�9h�'mC
�F���1�)��J�gF�~1D��g=(}�`ϱj�ݑ���i�õp	}��mB�D"F��a���دogE�qCg.)>.F�׍�^�
�$��dD�ԏ�,���[t;�	�+�����e;5��������0�os�U����ld���Xs�7��b���P��xM��A�ڄz�*�z��ό�m D��6�5��PVl��D)y���/C�����yRi��W�e��!ס�E�yg<��d�	�]�`��Lu�z�>�9���G��%�М�2����z��JQT��k�H �V���� Od*�)-�(��yt��H�b+�Q�v�l�m�s��R�d���fR�oo	���A��d���J@�ǋ</�E*{��N2lE+E	�j���3��yZ�:��.����}V$�6�����t*>Pj��E)�F��JDaޟx�nL̋�m�J�*%��E��Ƞ��U������ʴ�͠���X1���k����Մ��Yꮡ�k�X�����b-���()���F�ʷ>[�|�����zX�ӹ
#g�%��~/j�n0��Γ��Jz:�j('=��$C=��~�$�Ш]׈�Db�=��0 7qI݈J�r�FB]�E/��H[��`(�� �DU�qa)���Ĉ����$�'J���%�"F�Po��0���Ѵ�#�nkd���En[YQ0 ��-�rY�|�ό�߭����VFa-j�����}K��*�X[��6�G;���Dqy�ˤ0�� P���]�OiV�[%�^#�ݣFG��Za��z���b�Jv���b�;�S2�N���?��U	rձVQ���$/���F�k�v(GTKnL��N�Ż�ꖤ�X����Yq>؎�Ѳh2^8���TXr�l����lAC�;�5DaU�%��a%���ՒՄL���Ln0�D@�6%����,Ɖ�nj�<F {�w���w�F<0/7'�\�����\������.������d�pg���'�d�-ƽݺ�(�Lw<-�.�݉�3/W�f��9Z}h�%Vf��Zq�~�j0����Qں�$���+��s �������ΟnW��6$�B��D��,>{Eo(�(���1�����VLOå�HF�\:�������;,���
rt,+��-��Pѻ��K;~����1M�qN��ѻ��9�����R����+�b���o�w�]���QDC1�H�����ka0�T{��C��a���V3��q�8�r�Ϋe[S�V?g�C]�`�Y�a=�P�M5����V������ ,�ۮ�U�%\�����
#�{��j��7������;K��x>��Y
ʤǧm��y�]��5�a��d�pB�\M+��4֣�==,��F$��0�����jl�
;,�ض�"X^���-�F|O/u���V�K]��6��̋��B��R�kmb�T�b�������R�f�K��"�z<���v7������{d��l߅>%b{�-�S[�x��:
+sqd_ԇQj��aZ�%�"��ԇ�/��<u�|�$�ҖY��tKB��X���")�M�KB��{�|�y��(����~Iw<W6/�E����t���ᔉ�7���S��PE {<�g�&޻�k�_�%rl�����*5��}#oE�!�ˈ�xX/�� �(�p[㕻"����`�y�\��(r���S
����+G��4��Z�"o�E�t��,����Շ5p�KjpNj�Zo1���u�Å@�|n71B�����۟�E��,ϝ�T��,&��QPZE��`����S�ȴ�t�����j�BMEt=Z�J�=b�����g5�m�c1Ǝ/~�K�(�]�R;�n45R����6��@��֟*�4q�H�W_�^���������{�]١����]�d�!�����Rr(�Y��k0���ϭJRjq�V	i"W��E���+E����wI�CY,zŲJ�!�o�RpV^������g��qG�=`�@��Hl��ي��Ǟf��Z�!�zuߡD���.Lo&M􃼒��x4'�=���.we�>��(s�N�����P���iH��Jk�P3'|���a9P�L��F������_�5<��9��@���u���a�� �����Ɣs�h����~��F���J(
�,�ZLY�������:���d&���Zy��n(�k���d�=&�=fd��Ga��.î�zVWo�5�~.n( �1��(���nh�\�xW�2F�����PK�B3RD���-eGQl�a��=A�`�c�7V�bɩ��2�!`*j��{]Q�l��8zI����B�X-A{}GRmI)^;ToL9L�� >o��d,���	D)f�?WP0#���F�_gSfDo3	{��&�����PTє���TK�n3��>�B�"����t�úQ/�,�0Ju .L���;
u���} q�B4v���^C@)-�8<7:���Ϋ-gL��    � T>Y
�PX�K-'�t/���q�\�w7�ju:�|�X��DT�=Q���p��V&��~4�M%柦5��-��E��mA������P�E=㏒�{b����/-��`G��)���s�aF��=Jq�)!y��OhKa�׫u��J�;�нx���^^�v<�j��K_^_�7vڄ�2�s�Pf+߻�P_H���	e���Phx�iq�ƥcA��+M%ZX�}:����K�`9]]t�ңz�t�t㰸#��Xe�R�PY^�#�[��.���8�d��O�.}_b!�d>��Pwʮ�%� �FIw�ᚊ�bD��x(�Qzw�I�l3c�a9ĳ6(��'�4��M���9��-T�i��n�4:[|�ZJ�a�-��%W.�H��`ggC��{b%�ߓe5�~��d,+��ሚ��$!�EW�$��e�N�V�`�H�eu��] ���1M[aoA)���R�O�-n���j������v�3Y�*w�e�W�$n{��E1��S�z��)�Y �=�oa�+ȫ��5�l���F�X�3	�l���PV�_`�;b]�},R��X5zi-,
t[b��γ����ܝ��j�]ebI��ʫUy�עXU����P��)<���2�v���R�<z$88XSԧyo1y�S�~}�\����'����*�D������ƹh*^�/{*�-8�4V[����Q���R�<���-|�ǒ|�9aY�R�rCn�ECT�~��(���D���ka�An�
%�L�^IVj�Z��2J�5������?G��{r�n�xS��(����9�f6S�{����bK�" �����i;�U�Gy�}r�%����+*��#Y�ЏZ���7i��\�Z9�K(-�`�:7e���EԈ�?�G+i�a�{�Ya���t�N�#���������Y����S�ָUV%�N�pO0o�ӾU�v0`3I�՜��bܗ9Td���X %Z ��,�J�fM�c?o0�q[mK@�U�#kS�0����{�(LZ���xH�t�Р�>\yrCq��������,#���:
�%�E�ű
c��-��	6��8�̌u{�\ĚI:��  X�G_u��� �Dn
�:%��E�#Y|�xUv�A[
n&�2�n=���b���y���b7RYo�F2��L>X��@�d�o͂j �W��d���ŀ��M������{��W��ڃ ��w�g"�Lܲ��]�/R����{�h:a풀̓X�/��
C�'d74�j=P���ӭ/�.n(�$e�bT]�c5t1��� -*���-���*}1����%/�6��6}�W��zp�\tq?^��
E=��a���>͍��ټ�Z��s�� 	|�����U����Q~1�[ g���wm( k�>�Wx��v��z�ʅK��m<�@������p�D����`��5��g�T��n4��Hָ=�b��G��.��
��W%�#zMr�^q`�䫵�w(�����f5.����y�������Z*�$��O	���k��jF*�tʏ�Oh����n5�����)p� ���g����
��Q�]0v��g��=i0H)�o���=��p�a��ݑA=�!�1��D��hԜ>�)�Ӏ��Ћ�|��f�tE���$M��P~�@m���|?u6�O?���2??!�zY/aD4Q	p���Lܯ�xuk�z�/M��H��r�� �~�Ey�i��۱yg��j]abL��Z쎂M��U '��j(L�o���|h�
�s��w0g�h�RC�|Ǘ��d���&�oC\|t���0psu�L���u�Ĥ�>�Q� �f�=m;;ގ4n�3=�>PN���jbw%��r�ּ6�ȎSW���e@Z�?��L��Ԗ�{��ڒW%�.p��Jr��굈���\�{	D9��W���3	��G��������iE������z�9��\ɇ��شS��W�j/-�X]��9��w�A����l�t^_�F���b��:��5�3t�[�eH!�C~>���;�$i�X�W����N��a�9����g���ׂWr2�Qr�.&���j����_U��&RYUe
����\l}��O�De6�m-�Foe5������W��Tgǹ1Q�n0�����q�Ӄ0y�#<��]��5v[}���ۡ��L�%H7[�`��v������WS�S1�x�a=���}��e?'���F50r�yc�vEH�T,�E�����(Q�C���s{-�O��@`�3eQ��[9��\K��T�R����M�-� ��`�)� ʩ.�m6q�:^h��5wjb��*&C���R�j�!�m6��*�g��"�p���R}`�r�D=jj>��R��@���hvy#�ʲ�+�c���<� �F (���`��k=��`1�X,�B���ߠH���HN��Qd,q���Q*:�VQ���n��e��{�N�I�υ%��Kd���|3XK�
ٝ��\�Ճ�-Y-���A��$��g�of�B,�#b�Xjv�y���ݷƿa7�G)����(�F��ۗ�ȭ|���zw���j��ν����-Ɖ�S��}�~��<nj�?���OV��7wB�������� �5�N�h��RyS�Q�>�������z�˂��m����/��rG�U��������@����ҹ�z���[b[��o�T%��k�
�=M��'����cai-���Ai,�N''�)W�v5Bu��^���v����Hh7�f�������z�(tK�>�F��9�eȒ'ZC=� �;�2D�Ƃ�	'mj�ծ�z�5�v�lL��ac�p�#&��O<K��ĺ����;f8� �>�r�#���,i�rҀ-��w��!��4<�Jr0nĆ��G&���$�W��bd#9�� �����E�3�9'��(.˖�̞��q�;kg�s޳�d�JvM�����`0ڼ"0�o��+�FqĵN��#�;���J��#!�ʀ�	�Ğ�BlU���W1L���ۿIxi��f)�%�m;r)���c��@�h����3��!3m'�c����vV���S�A� Z^<��E-�s�z����~�01���a�,��H��3�ַ�Úi��+p�! �Y��(S�o,C��֖�����<�䮬�Qt߱F|T��8/��ٟ��Ʋ�=�G���pc�:5�yŊ�v�y��/�2��p���a�wGr�b��03�����C�(�W���yե���H/�3}c1�O��Z���(�y�O�z!��8�N��>�x�k#^nK!�9y�xޖ����:�B=��+ɞ��%Z'��<���wĕ�(魺w;
%�z,����A0�4=pSrT�'mG�F���ŅcQUT�7�,J_=q�q��c���z1��b��z�>�!6�؏�d]���P��.lH5��w���*�o*�Fz����Sxɡ*Wt��ʜ� �M�5�k#v6��'��N ��(*F8!FOz�_�k!M��D�]5�1İ1�'��Wn3o��i�m�ӭncx.#��|�3X-'�(�R-��k(,F�y�a����=��gB)�˙d;�CP�'�MO�2�o��#�a��j�D!7JyWO���8ދ:�<��)�Qi6�;3�m+���=�U/�.�����������j�5�}`@6�;���Q|?4Σ(J���D�]4�Oc܎ߙ�5��l\7N�|�҉C�֨.��Z�+՝}{3Ώؕ�l��N��x�c�� �Oy�C[g��&����-�1�t�,,�3rE'�η�Ц��hn���ćw�m��Q9���+np�s�^	�j/O�]Sw�A�]����=� �O�2������]JR\)=�*mF觫��n��!(kN4�xI��A��P�i�+�57��H��޻�\�ْ�4\)tY����P�10�J�uSU��|?��!�f\;F���f�j /Ձo	kL/vg���P��8�l��@6��� u*YÐtW��MUL �.�bI��G�2#���v}�#��qEaS�� ;�g�aҽ�;�(9",:����P��r �*��b�Rk��v�lZ�F���RCA    y�%���4}9߲oy��j�����)[���ٶUЂ��R��F߀a�����A�j�<Ӥ��K�jb���B�}`Ԧ����~ܷT;@�Nc�b2ѓ݋
=����7�$����I���b�u��~�d�%��k��" ��P��2_�v�q��^q͖BZ��Hiѣ]�`U���m��ׄMҤv�Zz���*�Nn1쵡�D[�`1L��`G}#���} ��@����`�\ɚ�9C�'�o�s���
�hFrG��[�e
��v�`q�,Н��bX���m��'�Z
Sl�~M4X��Q�k5�슠�cɊ�:��X<WLW�]/0�o�N����R���&���	Jv�f5I��ǽZ�8�FC�F���.�f�?�ք�$�	�Qp �Rx����ߨ���V����T�]�>�]�?z���r�~@Վ�"�����+!'�P$j5中�]x����>6#(u�N/�:� ��5�p�sp[���c�rM&_���99�gl|�l������=��1��c��p���Sfnc���Ԃ�i�k(�Q%��v��]��Sq�#�S��y���Y	 ��ӨDg�Q��?��Fi!;{���ҿ`�M����j:��K�{�i� .&�/-����l0�����* Z�|��a�ı֜�cRk(1Kӱ��v��>�Us�C����
A5����.*0`��_�܀��Z]V�ڗ�4oޑ:\=����M㓙��ȇȇ�P�S�@,z�;�3D��;9RH�q��
�1H���pB�fl�n��:LL1{Vr1^
>
ϫ'53���Y�2�_���D{��o�Ղ3Z_a;A,�n?�E�*F��[�d=��V�dW3���ÓaKN�$��[��"����j����rz�|*�i��Ŵ�u|���F2��PĔ [ŜmIY��%�A��0����iC�[�oқK	�G��@Ԉ�'?�o���^���-�o��-~�Z�\������h2D-T-�&G���JX_�Z�㵕����
)k7�t��[�X���v�P���Q�c��-�5l��#n�1��R-ɜ[՜�\�\[��Lƕ}K�6���:�s�r�����~P��|�u&��[�El�F�qA:�����@�T[3sg{�`5�:ۉ����Z���Ҳ9 ��Vwi���:���B5�g6�#ԁ��ڄ��T���"6��f�:��(lC�CA����i*����pQ l�P�Ŵ	{�p��Z
E.���Lū�+MO���.���ʵ�~'��c��&��u��]E|�<R%����Y#���c�a��wp��� ��Xo�IV�ŕQ��M�ڤ:����"ۼk��Hxꍩ����a�e^���%��n�y��� ��.�Gv1p$T��P�����9����RX��_
��R�P��L�?�ב����F >���uZ4���z����o.	��/�o�a�	�	·�õx��S��Ϙ�$@�T��TÖ����������g6�����qx4��t�mXk�<���O���#6��^T��i:e�K
w�1d|l��,x����F2�0�z3��#{5�9el��ie|e޹��ǫaY��l�C�5J�y��uh0	Y@�.�,�K׷P�3���!�[-�xO�F`�Y��MSAo-ʢ�p4���z�~����� 얮�K
ޜ���A�̅-����������8��R$u,ܗB&4�O+�{�{b P��:J})��.�{�9`�|\�+���+�C3_�r�����w;�u�n�����a^�lM���*���"��� ԙFO�(@�;�=Mk'�N}e�O��'�)T��̒��Fn���7��#�v(K���f*46�yMZ��w��z��2|]0*��]����@c�Dƿ�r��#Vr��`�ڞ�8���2��';5D�S��]�m�\�z��;ג���Zoi(ԙj(�zM�-ae�t
��p���'�:���Ma[yo>M+i�?f��J��o
��E�.G�����q��쟕�$���U�U]	ƶ�E��\u/Ι��j�,�(Q�%Kׂd�kJ�n��^�<�J��-e���_���x[�2�4&��lh����"ª�V�y��R[�s��M��P��p`���QW�1�%]���:v���s���˕�fs[�;� *I�e7�ۚ)�S��IdXjѼ�)J@�[����itPV��N>v`@�1PǺ�����H�O� �~���G���J�=�`������ a[�g3Z��T��$8tdtI�+��EF�A��L��p����ˤ���š:� :Ju*�KcX]�-]\a��J�%�F8]���_�E��}5,;^V�'\�A��/��J���ĺC�����O%����t����mQN������HV��k���m9��5�����M�Zj싶�6ZC�XZK�H�e�X��:�k{�j��6�'EK�,9}�Q�3����Ko�z�>o��|�(�ЮjB9V"����P�p*��xՑ+���[^n���0�5�9�o5���]I�iԎ�0c���5^�r�P�&TY;'i�,9�&��0h`��j��k�2a�e�ZK܊�$����I�%Vp�H+﵄W�lZ|a��%^��zQ�M�y��^�&��0�j`���q�w�"}�3��¹����f���M�度�U���ƒGdX�{�|z�NXR��3K�����0L��3@�=�m	�,��>��!���Ћ�^��FT��.����ғ��X̡�R���x)�f8t94�]�q7�v����KJ�%��{們i���~���n������T����8rb^{S����Bx�U�O�X�~��_�q�KC'�6���M�ioj��y>P����ۡ�1,���Iq5
b�t\�am����'j��z��R	ѥ]�����<�̈́56�j�H:�:��w�$= �[f_@$�-��3�,k�60�4["�� �D�|�b��*K��zڋ��iĿ���[��u��]�ki�����ӾՎ�[�bT��έh��l`mkM����V�7^��\B��45�^�\}��}K΃Ld66Z\�2��[�L�M����n��׍�b�M��'�r	i��a��Z-��M¿neS�j8�z(�|[���0ЄM}� 4#��_=�Z���ӡԇO�Yʻw�8B҅\Ӯ��-&M�_�RQ�;�`%��Z��qłQ:��)f�Þ�qͭ\ܕ�̭�,hZ�̏�,��L�;�j�����.��T���D�'�ko\����4k��쓕3SA�H�5עT�W��	� ��}�ʌaQE����D��� %�6n@��a���H�[��H9�i�[�D��J�	�|��Qǵ������Z��K��[�N���6�v$�\��+���mI�r�4Kb9J���g�Ғ�-{g�g)�L�����VY�$�P�Ob�_�!��+6*0�F۟��;�v���_�*��CR�>�������`�C��vE)��~E٦�}6h�@@�e���Ũ�qA�浴�Kgr�ac��tAc����QCq��p�Ca�v=�^���(�Ñʽ���>g��^�&׶#F7-�'������M��{1��͇�}��@�J<���u��F�n7�GI�}��"m��_�o�>��Q.k�?�r�Y�0�f��X
wF�4��Ƚ/-��e��nh["di�ew�Q;�@p�?���̉㚶嵥ਡ�Q�o��
7�T�9|��]����s(�C���g��HI?���oU%�X]K8��2,��^0
���n���Hm���:ە�(�.��J�a�a�z\�#�֢��Ab�m��^�b��/U�ډ���ZXTY�
xmKL��*�	#���ƞ������=���pRu��CiK�DH֎��c�=���+9L���cS��,�8qQ]��ë��R�7nc�%W������-�1Lt�P���Rp�2ܐ)����Cb]����q_��#�$Ǐ���9�U0!�����¡8A����P�U�����s�й:��`]	?0��N��"�SY�P�68�5e���íʧV�e5�K!�ݷ��a�   ��d�3�K�ثM�bbL�	��('�B@3�m%�!��ʲ�-E��w.���!���>�MRj�Z1n@�X�tW�cQG�Av�JX���}�Rf�$O0�T�`@�9����R���p{���r�`^=��D�&�� �M(E��lj���f�hl���ɤW>���s�w��K}���\.��}�:A�-�����m)�t�]CqW��C�tw�[�bC5:�uɧ9׊�&�v�0��j:���~.�&�KN0��Ɠ0���F���R?Ѻ��g{��<!Z��yt��!��B+	<�yO�ցB��Z��'����y&,s?��� D�C����F.��(A[ېK(�D
���[��ƨyFdߡ��H�`�|N>D�6�-Bի�v,2��0>�\�v}��04~A�N�y�(���"CuܲQ�zH�Q�Tu�{7���B�ki!j��f�7j|��պ��S�1�^�vK,H� Ȗ�Oj�Q�E�3*��3��@X͘�<��k�P���<�V�P�r�l�t7ؓ_����Ȁ�����@��Pj�Ǫ��f�'�.�M�qM��uk�0���o�hd/)�`�H��jxg<�;�;� �Ȟбʽ�$6b�&�x4_0���E'�,���'*Na�>�z%��NR�토:�0�@����Dԋow"�p�NȔ��C�,�Pԑ�G�U�E(�v�H�款{CP-�y��l���4�T�������l
�R�5%k�["Yu?��O��跭�N�ƺ -���b����EpCwE�mW_0�2�!��i�2O1zId�l;�j6�v��:O�\�?� l��)��CQ�A�`pA��xn�\�7t'���ĭ�?�o��r��R�&�֯��"ΨC����=�H��YC���v���⬅q*�� �ojbP�&U�JI2O��o��S�!�cs�H)6+q�[��l��XTI#dG�����}���Z�Y!E��aq�Aj�g&�Ȼt�����DU3��X���
���3�]F��uT]�,>s�Ԯ�7� ��$��*JB9;��\��ޗua~�0$k�u�K�|f껐���H�g�� �dOqm<{Ӏ#�µݸ`+����āy�f�:2t���$��s�@��Q����Qj��G�S;�����S����V�أ5x1UF�&���ٷ��H�Z��������{�F�(���(��j��;d,m)4�L3M1Ľn��~T�@���D���ak���n����0��&c�)�c�w|�,�"o��OIC����Q�L߼_���bV;��<\&��_���\Q.Sʲ���m$zN�H A�B���5��j����,�)Q[
���q޻!��}ۨї�|� �Fx�(\x�o8)� �R*|%��ş�	M|D���LP2u�e�f)~�g5��up����C�-�����G����7y��%1����e�63C��x2ᢣ ����m4��X� �-p 
?�=7��s�pJ������L�#�{k���S3��$����(�of�h��?���j�~��*f��t���S�����8��G
4�}XM��[��t�����@�@��~dWVBD���=���߿ ��l�1+�r6귀��@1�'��N(N�gM�E:�����ᵱ��לx1?�x2�n�-1P�0�VB�@��s:ɟ�r��
���Xƶ�b���9O=O5�b�n$V3���8���$K�|_DG�l*�~�]V
��z���)��g�F0���F��ڮQ��
a�$�V�\ a�ف�$ջ�P+��w5c�+я9Iv|�ieq0u�5O4�v`�~5R4��&_f��};ŧjz����B�gM'�Z[�j�9O0;R�'
�$"Y�G;���ffĞ����jX�{�2�����$�t�?�1\���/�#�0�2��B�g�2^��~���_h�
�.�4A�O��;�St�(����J�M57:"�n
�`�d��<�Y����2�J{{1j��-�z]�ֳ�!��X<O4�Py�U*AmK�"����;�2���/~�9�PZce5�k�r/�r
�tdon�e`�wH<L[/e��E��PhxB1��R!ZCLl��l,ч��5��xV�Հ����C����&6�%nJ���y�s}G(kH��k#b��Vꗬje-:����)����#Ʈ�v�ޓ�V�S�a3
ĳ�$��0Y�y�t�R0�o8O<9p�M[t�K��.[�O�0����i8�哂���21O��3��G&�A���{4!��q�Q.�!�p4I�nS��c:����̧/K4�����=Vqo�G���5���=\k��:]�9�$�mJ�����H�3ܤ~v�cԤM<[y ����� ���3A_i�	kW�^=�Y�7���X���r#�㮏��E�i2\���IO�_�h��������#��C��ص}*�����A��DD�t9�i�w�Q�=D����r�#���D�z����.���:
��	&5��B�j�=��·�:�5E/�J���r���B�Hn�$���^����'�I�P��V�F&t��.G�����ǫj�Jw�ĔO���VyrWb?kj�&b��U�ٚ��;�7g�f^�.�����қ�tɧ*�^�jD{��/�2�h/<1�&��~������hL!��m�`&G�����-�1Ťw�''��Ťw�4c��.Z�ȑT�<��#�$s�h��G�NV5t(����Y�W�xQ�Ŀ���0�Q��z�(���J�0�'���yj�\����mܘҐ<����:X;�c|8J=�輻���۬m���\A�?��ub���`"k+�my���#�^��M�k�`eU3O+�m�i!5m-���&v�b�hY����o�ȷ9����Ԛ�&>�yf���I&��Za�r<S����a��\��R�^s�7e"�$�t}ۛ����P����
������~�<�`u3�t�l2����8�{m�&�N:�A��Z��F�XCq��6F![:DX������nhH0�x� �{��#�I�t���d���LX;-ŷ=�E�/(����H}����4����(5I��j]Oc�ʪ(���;4�A�p�����t/{�~�\��#ъ��9��"5Sao���{6�~�W�_��d_�_�)I�Ɓ�+6�N�(l0�/NИY#��	R�:�Es�P85X�!�	��_4�8qZ�o�=
�5��� �y�zS��hn�\�7��/��U<V\a��&H>J����L�U��AN(���H��08�Y0�ٔ��,f�n�o���kC      `   2  x���=OA��_���|���ZYP�L��c�������ޝ�w6_Lo�i6_ޤ��Ǘ��?|�^�?�����t��4OM�A)���1#S�֑%��Z�P/��痣�?LLa�)G"��UK���Q�@p�I��q�,��!��L���ԿMu��ӷ���E3sY�����<O�$�`�%'&A Gٓڡ'�>c%���2������2��*ܟ�4�}s���
����!'�J��z7����T�:5U��a��k3�r`R�M��H���L�\gw͚�����kT1p��9}ۄ@      ]   o   x���v
Q���W((M��L�+J-�/*)Vs�	uV�043432��02�Q01�QPO,N"uMk.O�t[��Yu�Zu�&g��������juzbQRbz*H; 
�4�      [   �   x����n�0�{��7�4Mj���Nh*Rc�;����)J���~a�������}UOP�O�pK�%����w碂i�������[V
�U�/\k)��,�/l�����}O�����v�#���ڻ�2��w����(6vdF/%�<��K�X$!N|���
�'��B%1��\*�I�=�7�-���Zj��-��RJky��{���

��Y�	��}      _     x���=o�0�ݿB�Z�&��c�)Ф]�~x� Em����1���,ÚL��ݽ$׷w7�����������㏰�lw�7���n�|�����]�uٴ�+�a��9e� ߁������֡>`�Ȑ���>o~>��nz|�~���UȢ!z���
^��Q`�*Sf	h'��g*"ʠV#IT�#�J�@�*�u�ȒJŊ��S3P@�J�JM�jf�Ԙ�|1D��x��W*������Y,D�������u�yj	q�w�b��r��Lf3U�L��/�� � �IM`��e��wO+tpQ�vEݦ��Q�ŵn�B:ڴ�r1��v�m��/����B��IC����� �Eի�t�1�Pry)QN�q�(%�)�}=e�Z����p@��,�d�s1�EK�dь��X�Ֆ&[ N�d��p{.�:��>�=�rq��{0�g�/m�h��C�$�)g�����z!k)���Wn�������͂��r`F�htÿ��5Kݦ��jp���W�S]�k�-��,�      E    g           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            h           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            i           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            j           1262    28415    gr-2    DATABASE     �   CREATE DATABASE "gr-2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE "gr-2";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            k           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1259    28418    accounts    TABLE     �  CREATE TABLE public.accounts (
    username character varying NOT NULL,
    "userId" integer NOT NULL,
    password character varying NOT NULL,
    "fullName" character varying,
    address character varying,
    "phoneNumber" character varying,
    autobiography character varying,
    email character varying,
    role smallint DEFAULT 3 NOT NULL,
    "subjectId" smallint,
    birthday date,
    gender smallint,
    "avatarImagePath" character varying
);
    DROP TABLE public.accounts;
       public         heap    postgres    false    3            �            1259    28416    accounts_userId_seq    SEQUENCE     �   CREATE SEQUENCE public."accounts_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."accounts_userId_seq";
       public          postgres    false    3    203            l           0    0    accounts_userId_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."accounts_userId_seq" OWNED BY public.accounts."userId";
          public          postgres    false    202            �            1259    28438    answers    TABLE     �   CREATE TABLE public.answers (
    "questionId" bigint NOT NULL,
    "answerId" bigint NOT NULL,
    "answerString" character varying NOT NULL
);
    DROP TABLE public.answers;
       public         heap    postgres    false    3            �            1259    36729    friends    TABLE     �   CREATE TABLE public.friends (
    "friendId" bigint NOT NULL,
    "userId1" integer NOT NULL,
    "userId2" integer NOT NULL,
    confirmed bit(1) NOT NULL,
    "dateConfirmed" timestamp with time zone,
    "dateRequested" timestamp with time zone
);
    DROP TABLE public.friends;
       public         heap    postgres    false    3            �            1259    36727    friends_friendId_seq    SEQUENCE        CREATE SEQUENCE public."friends_friendId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."friends_friendId_seq";
       public          postgres    false    3    215            m           0    0    friends_friendId_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."friends_friendId_seq" OWNED BY public.friends."friendId";
          public          postgres    false    214            �            1259    28494    peer_review_results    TABLE     �   CREATE TABLE public.peer_review_results (
    "questionId" bigint NOT NULL,
    "reviewerId" integer NOT NULL,
    "hasApproved" bit(1),
    "hasRejected" bit(1),
    "rejectReason" character varying
);
 '   DROP TABLE public.peer_review_results;
       public         heap    postgres    false    3            �            1259    28430 	   questions    TABLE       CREATE TABLE public.questions (
    "questionId" bigint NOT NULL,
    "subjectId" smallint NOT NULL,
    "answerId" bigint NOT NULL,
    "questionString" character varying NOT NULL,
    "creatorId" integer NOT NULL,
    "difficultyLevel" smallint NOT NULL,
    "timeAllowed" smallint NOT NULL,
    "passedPreliminaryReview" bit(1),
    "passedFinalReview" bit(1),
    "passedPeerReview" bit(1),
    "hasBeenReported" bit(1),
    "hasBeenAssigned" bit(1),
    "hasBeenRejected" bit(1),
    "rejectReason" character varying
);
    DROP TABLE public.questions;
       public         heap    postgres    false    3            �            1259    36712    rated_test_results    TABLE       CREATE TABLE public.rated_test_results (
    "userId" integer NOT NULL,
    "questionId" bigint,
    "answeredId" bigint,
    "submittedTime" timestamp with time zone NOT NULL,
    "ratingChange" real NOT NULL,
    "subjectId" smallint NOT NULL,
    "updatedRating" real NOT NULL
);
 &   DROP TABLE public.rated_test_results;
       public         heap    postgres    false    3            �            1259    36667    ratings    TABLE     �   CREATE TABLE public.ratings (
    "userId" integer NOT NULL,
    "subjectId" smallint NOT NULL,
    rating real,
    "lastUpdate" timestamp with time zone
);
    DROP TABLE public.ratings;
       public         heap    postgres    false    3            �            1259    28518    reports    TABLE     �   CREATE TABLE public.reports (
    "questionId" bigint NOT NULL,
    "reporterId" integer NOT NULL,
    reason character varying NOT NULL
);
    DROP TABLE public.reports;
       public         heap    postgres    false    3            �            1259    28446    subjects    TABLE     r   CREATE TABLE public.subjects (
    "subjectId" smallint NOT NULL,
    "subjectName" character varying NOT NULL
);
    DROP TABLE public.subjects;
       public         heap    postgres    false    3            �            1259    36724    subjects_id_seq    SEQUENCE     w   CREATE SEQUENCE public.subjects_id_seq
    START WITH 9
    INCREMENT BY 1
    MINVALUE 9
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.subjects_id_seq;
       public          postgres    false    3    206            n           0    0    subjects_id_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects."subjectId";
          public          postgres    false    213            �            1259    36648    test_results    TABLE     w  CREATE TABLE public.test_results (
    "testTakerId" integer NOT NULL,
    "startTime" timestamp(4) with time zone NOT NULL,
    "subjectId" smallint NOT NULL,
    "questionCount" smallint NOT NULL,
    "correctAnswerCount" smallint NOT NULL,
    "testId" character varying NOT NULL,
    "difficultyLevel" character varying NOT NULL,
    "totalTimeSpent" integer NOT NULL
);
     DROP TABLE public.test_results;
       public         heap    postgres    false    3            �            1259    36646    test_results_testTakerId_seq    SEQUENCE     �   CREATE SEQUENCE public."test_results_testTakerId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public."test_results_testTakerId_seq";
       public          postgres    false    3    210            o           0    0    test_results_testTakerId_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public."test_results_testTakerId_seq" OWNED BY public.test_results."testTakerId";
          public          postgres    false    209            �
           2604    28421    accounts userId    DEFAULT     v   ALTER TABLE ONLY public.accounts ALTER COLUMN "userId" SET DEFAULT nextval('public."accounts_userId_seq"'::regclass);
 @   ALTER TABLE public.accounts ALTER COLUMN "userId" DROP DEFAULT;
       public          postgres    false    202    203    203            �
           2604    36732    friends friendId    DEFAULT     x   ALTER TABLE ONLY public.friends ALTER COLUMN "friendId" SET DEFAULT nextval('public."friends_friendId_seq"'::regclass);
 A   ALTER TABLE public.friends ALTER COLUMN "friendId" DROP DEFAULT;
       public          postgres    false    214    215    215            �
           2604    36860    subjects subjectId    DEFAULT     s   ALTER TABLE ONLY public.subjects ALTER COLUMN "subjectId" SET DEFAULT nextval('public.subjects_id_seq'::regclass);
 C   ALTER TABLE public.subjects ALTER COLUMN "subjectId" DROP DEFAULT;
       public          postgres    false    213    206            �
           2604    36651    test_results testTakerId    DEFAULT     �   ALTER TABLE ONLY public.test_results ALTER COLUMN "testTakerId" SET DEFAULT nextval('public."test_results_testTakerId_seq"'::regclass);
 I   ALTER TABLE public.test_results ALTER COLUMN "testTakerId" DROP DEFAULT;
       public          postgres    false    209    210    210            X          0    28418    accounts 
   TABLE DATA                 public          postgres    false    203            Z          0    28438    answers 
   TABLE DATA                 public          postgres    false    205   �       d          0    36729    friends 
   TABLE DATA                 public          postgres    false    215   Q
       \          0    28494    peer_review_results 
   TABLE DATA                 public          postgres    false    207   G       Y          0    28430 	   questions 
   TABLE DATA                 public          postgres    false    204   e       a          0    36712    rated_test_results 
   TABLE DATA                 public          postgres    false    212   �       `          0    36667    ratings 
   TABLE DATA                 public          postgres    false    211   =       ]          0    28518    reports 
   TABLE DATA                 public          postgres    false    208   B       [          0    28446    subjects 
   TABLE DATA                 public          postgres    false    206           _          0    36648    test_results 
   TABLE DATA                 public          postgres    false    210   �        p           0    0    accounts_userId_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."accounts_userId_seq"', 76, true);
          public          postgres    false    202            q           0    0    friends_friendId_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."friends_friendId_seq"', 250, true);
          public          postgres    false    214            r           0    0    subjects_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.subjects_id_seq', 34, true);
          public          postgres    false    213            s           0    0    test_results_testTakerId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public."test_results_testTakerId_seq"', 1, false);
          public          postgres    false    209            �
           2606    28426    accounts accounts_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY ("userId");
 @   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pkey;
       public            postgres    false    203            �
           2606    28428    accounts accounts_unique 
   CONSTRAINT     W   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_unique UNIQUE (username);
 B   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_unique;
       public            postgres    false    203            �
           2606    28485    answers answers_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY ("answerId");
 >   ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey;
       public            postgres    false    205            �
           2606    36734    friends friends_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY ("friendId");
 >   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_pkey;
       public            postgres    false    215            �
           2606    28500 ,   peer_review_results peer_review_results_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.peer_review_results
    ADD CONSTRAINT peer_review_results_pkey PRIMARY KEY ("questionId", "reviewerId");
 V   ALTER TABLE ONLY public.peer_review_results DROP CONSTRAINT peer_review_results_pkey;
       public            postgres    false    207    207            �
           2606    28455    questions questions_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY ("questionId");
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    204            �
           2606    36671    ratings ratings_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY ("userId", "subjectId");
 >   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_pkey;
       public            postgres    false    211    211            �
           2606    36862    subjects subjects_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY ("subjectId");
 @   ALTER TABLE ONLY public.subjects DROP CONSTRAINT subjects_pkey;
       public            postgres    false    206            �
           2606    36896    test_results test_results_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT test_results_pkey PRIMARY KEY ("testId");
 H   ALTER TABLE ONLY public.test_results DROP CONSTRAINT test_results_pkey;
       public            postgres    false    210            �
           2606    36863     accounts accounts_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 L   ALTER TABLE ONLY public.accounts DROP CONSTRAINT "accounts_subjectId_fkey";
       public          postgres    false    2750    203    206            �
           2606    36902    answers answers_questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.answers DROP CONSTRAINT "answers_questionId_fkey";
       public          postgres    false    2746    205    204            �
           2606    36740    friends friends_userId1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "friends_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES public.accounts("userId") NOT VALID;
 H   ALTER TABLE ONLY public.friends DROP CONSTRAINT "friends_userId1_fkey";
       public          postgres    false    215    203    2742            �
           2606    36745    friends friends_userId2_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "friends_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES public.accounts("userId") NOT VALID;
 H   ALTER TABLE ONLY public.friends DROP CONSTRAINT "friends_userId2_fkey";
       public          postgres    false    215    2742    203            �
           2606    36750 7   peer_review_results peer_review_results_reviewerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.peer_review_results
    ADD CONSTRAINT "peer_review_results_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public.accounts("userId") NOT VALID;
 c   ALTER TABLE ONLY public.peer_review_results DROP CONSTRAINT "peer_review_results_reviewerId_fkey";
       public          postgres    false    207    2742    203            �
           2606    28513 #   peer_review_results questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.peer_review_results
    ADD CONSTRAINT "questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 O   ALTER TABLE ONLY public.peer_review_results DROP CONSTRAINT "questionId_fkey";
       public          postgres    false    204    207    2746            �
           2606    28532    reports questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 C   ALTER TABLE ONLY public.reports DROP CONSTRAINT "questionId_fkey";
       public          postgres    false    208    204    2746            �
           2606    36835 "   questions questions_creatorId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.accounts("userId") NOT VALID;
 N   ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_creatorId_fkey";
       public          postgres    false    203    204    2742            �
           2606    36883 "   questions questions_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 N   ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_subjectId_fkey";
       public          postgres    false    2750    204    206            �
           2606    36912 5   rated_test_results rated_test_results_answeredId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_answeredId_fkey" FOREIGN KEY ("answeredId") REFERENCES public.answers("answerId") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 a   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_answeredId_fkey";
       public          postgres    false    212    205    2748            �
           2606    36907 5   rated_test_results rated_test_results_questionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions("questionId") ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 a   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_questionId_fkey";
       public          postgres    false    212    204    2746            �
           2606    36868 4   rated_test_results rated_test_results_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 `   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_subjectId_fkey";
       public          postgres    false    2750    212    206            �
           2606    36770 1   rated_test_results rated_test_results_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rated_test_results
    ADD CONSTRAINT "rated_test_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts("userId") NOT VALID;
 ]   ALTER TABLE ONLY public.rated_test_results DROP CONSTRAINT "rated_test_results_userId_fkey";
       public          postgres    false    212    203    2742            �
           2606    36873    ratings ratings_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "ratings_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 J   ALTER TABLE ONLY public.ratings DROP CONSTRAINT "ratings_subjectId_fkey";
       public          postgres    false    206    211    2750            �
           2606    36790    ratings ratings_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts("userId") NOT VALID;
 G   ALTER TABLE ONLY public.ratings DROP CONSTRAINT "ratings_userId_fkey";
       public          postgres    false    211    2742    203            �
           2606    36800    reports reports_reporterId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public.accounts("userId") NOT VALID;
 K   ALTER TABLE ONLY public.reports DROP CONSTRAINT "reports_reporterId_fkey";
       public          postgres    false    2742    203    208            �
           2606    36878 (   test_results test_results_subjectId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT "test_results_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects("subjectId") NOT VALID;
 T   ALTER TABLE ONLY public.test_results DROP CONSTRAINT "test_results_subjectId_fkey";
       public          postgres    false    210    206    2750            �
           2606    36805 *   test_results test_results_testTakerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT "test_results_testTakerId_fkey" FOREIGN KEY ("testTakerId") REFERENCES public.accounts("userId") NOT VALID;
 V   ALTER TABLE ONLY public.test_results DROP CONSTRAINT "test_results_testTakerId_fkey";
       public          postgres    false    203    210    2742           