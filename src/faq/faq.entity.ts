import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { Expose } from "class-transformer";

@Entity()
export class QuestionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('longtext')
    questionText: string;

    @Column({ default: false })
    approve: boolean;

    @OneToMany(
        () => AnswerEntity,
        (answers) => answers.question,
        {
            cascade: true
        }
    )
    answers: AnswerEntity[];

    @ManyToOne(
        () => UserEntity,
        (user) => user.questions,
        {
        }
    )
    user: UserEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

}

@Entity()
export class AnswerEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('longtext')
    answerText: string;

    @Column({ default: false })
    approve: boolean;

    @Column("simple-array")
    rating: number[];

    @ManyToOne(
        () => QuestionEntity,
        (question) => question.answers,
        {
            onDelete: 'CASCADE'
        }
    )
    question: QuestionEntity;

    @ManyToOne(
        () => UserEntity,
        (user) => user.answers,
    )
    user: UserEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;
}